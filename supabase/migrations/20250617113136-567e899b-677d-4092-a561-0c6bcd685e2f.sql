
-- Criar tabela para contas a pagar e receber
CREATE TABLE public.contas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('pagar', 'receber')),
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido')),
  categoria_id UUID NOT NULL,
  observacoes TEXT NULL,
  recorrente BOOLEAN NOT NULL DEFAULT false,
  frequencia_recorrencia TEXT NULL CHECK (frequencia_recorrencia IN ('mensal', 'trimestral', 'anual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_contas_user_id ON public.contas(user_id);
CREATE INDEX idx_contas_tipo ON public.contas(tipo);
CREATE INDEX idx_contas_status ON public.contas(status);
CREATE INDEX idx_contas_data_vencimento ON public.contas(data_vencimento);

-- Habilitar Row Level Security
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para que usuários vejam apenas suas próprias contas
CREATE POLICY "Users can view their own contas" 
  ON public.contas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contas" 
  ON public.contas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contas" 
  ON public.contas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contas" 
  ON public.contas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar foreign key para categorias
ALTER TABLE public.contas 
ADD CONSTRAINT fk_contas_categoria 
FOREIGN KEY (categoria_id) 
REFERENCES public.categorias(id) 
ON DELETE RESTRICT;

-- Adicionar foreign key para user_id (referenciando profiles)
ALTER TABLE public.contas 
ADD CONSTRAINT fk_contas_user 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_contas_updated_at
  BEFORE UPDATE ON public.contas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para atualizar status das contas vencidas
CREATE OR REPLACE FUNCTION public.update_contas_vencidas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.contas 
  SET status = 'vencido'
  WHERE status = 'pendente' 
    AND data_vencimento < CURRENT_DATE;
END;
$$;

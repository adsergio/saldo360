
-- Adicionar colunas para controle de fatura na tabela transacoes
ALTER TABLE public.transacoes 
ADD COLUMN incluida_na_fatura BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN fatura_fechada_id UUID NULL;

-- Criar tabela para registrar fechamentos de fatura
CREATE TABLE public.faturas_fechadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartao_id UUID NOT NULL,
  user_id UUID NOT NULL,
  valor_total NUMERIC NOT NULL,
  data_fechamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  descricao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_transacoes_incluida_na_fatura ON public.transacoes(incluida_na_fatura);
CREATE INDEX idx_transacoes_fatura_fechada_id ON public.transacoes(fatura_fechada_id);
CREATE INDEX idx_faturas_fechadas_cartao_id ON public.faturas_fechadas(cartao_id);
CREATE INDEX idx_faturas_fechadas_user_id ON public.faturas_fechadas(user_id);

-- Habilitar Row Level Security
ALTER TABLE public.faturas_fechadas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para faturas fechadas
CREATE POLICY "Users can view their own faturas fechadas" 
  ON public.faturas_fechadas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own faturas fechadas" 
  ON public.faturas_fechadas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Adicionar foreign keys
ALTER TABLE public.faturas_fechadas 
ADD CONSTRAINT fk_faturas_cartao 
FOREIGN KEY (cartao_id) 
REFERENCES public.cartoes_credito(id) 
ON DELETE CASCADE;

ALTER TABLE public.faturas_fechadas 
ADD CONSTRAINT fk_faturas_user 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

ALTER TABLE public.transacoes 
ADD CONSTRAINT fk_transacoes_fatura_fechada 
FOREIGN KEY (fatura_fechada_id) 
REFERENCES public.faturas_fechadas(id) 
ON DELETE SET NULL;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_faturas_fechadas_updated_at
  BEFORE UPDATE ON public.faturas_fechadas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

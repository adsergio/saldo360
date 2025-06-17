
-- Corrigir a política RLS de INSERT para contas
DROP POLICY IF EXISTS "Users can create their own contas" ON public.contas;

CREATE POLICY "Users can create their own contas" 
  ON public.contas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Verificar se existe a política de UPDATE também
DROP POLICY IF EXISTS "Users can update their own contas" ON public.contas;

CREATE POLICY "Users can update their own contas" 
  ON public.contas 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Criar tabela de residentes
CREATE TABLE IF NOT EXISTS public.residents (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  rg TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  housing TEXT NOT NULL,
  residents INTEGER NOT NULL,
  cid TEXT,
  disabilityDescription TEXT,
  elderly BOOLEAN NOT NULL DEFAULT false,
  elderlyAge INTEGER,
  hasDisability BOOLEAN NOT NULL DEFAULT false,
  isForeigner BOOLEAN NOT NULL DEFAULT false,
  foreignDocNumber TEXT,
  hasGovernmentAssistance BOOLEAN NOT NULL DEFAULT false,
  governmentAssistance JSONB,
  dependents JSONB,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso
CREATE POLICY "Usuários autenticados podem ler todos os residentes" 
  ON public.residents FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir residentes" 
  ON public.residents FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar residentes" 
  ON public.residents FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem excluir residentes" 
  ON public.residents FOR DELETE 
  USING (auth.role() = 'authenticated');

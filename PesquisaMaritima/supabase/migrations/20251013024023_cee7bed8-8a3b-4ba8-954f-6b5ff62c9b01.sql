-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_coletas_user_id ON public.coletas(user_id);
CREATE INDEX IF NOT EXISTS idx_coletas_embarcacao_id ON public.coletas(embarcacao_id);
CREATE INDEX IF NOT EXISTS idx_coletas_data ON public.coletas(data DESC);
CREATE INDEX IF NOT EXISTS idx_favoritos_user_id ON public.favoritos(user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_coleta_id ON public.favoritos(coleta_id);
CREATE INDEX IF NOT EXISTS idx_profiles_laboratorio_id ON public.profiles(laboratorio_id);
CREATE INDEX IF NOT EXISTS idx_embarcacoes_laboratorio_id ON public.embarcacoes(laboratorio_id);

-- Adicionar constraint para garantir unicidade de favoritos
ALTER TABLE public.favoritos 
ADD CONSTRAINT unique_user_coleta_favorito UNIQUE (user_id, coleta_id);

-- Função para buscar estatísticas de coletas por usuário
CREATE OR REPLACE FUNCTION public.get_user_collection_stats(p_user_id uuid)
RETURNS TABLE (
  total_coletas bigint,
  total_favoritos bigint,
  especies_unicas bigint,
  ultima_coleta timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(DISTINCT c.id) as total_coletas,
    COUNT(DISTINCT f.coleta_id) as total_favoritos,
    COUNT(DISTINCT c.nome_cientifico) FILTER (WHERE c.nome_cientifico IS NOT NULL) as especies_unicas,
    MAX(c.created_at) as ultima_coleta
  FROM public.coletas c
  LEFT JOIN public.favoritos f ON f.user_id = p_user_id
  WHERE c.user_id = p_user_id;
$$;

-- Função para buscar coletas com informações completas (incluindo embarcação e laboratório)
CREATE OR REPLACE FUNCTION public.get_coletas_with_details()
RETURNS TABLE (
  id uuid,
  nome_cientifico text,
  nome_comum text,
  data date,
  local text,
  comprimento numeric,
  peso numeric,
  foto_1 text,
  foto_2 text,
  foto_3 text,
  created_at timestamp with time zone,
  user_id uuid,
  user_nome text,
  embarcacao_tipo text,
  laboratorio_nome text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.nome_cientifico,
    c.nome_comum,
    c.data,
    c.local,
    c.comprimento,
    c.peso,
    c.foto_1,
    c.foto_2,
    c.foto_3,
    c.created_at,
    c.user_id,
    p.nome as user_nome,
    e.tipo as embarcacao_tipo,
    l.nome as laboratorio_nome
  FROM public.coletas c
  LEFT JOIN public.profiles p ON c.user_id = p.id
  LEFT JOIN public.embarcacoes e ON c.embarcacao_id = e.id
  LEFT JOIN public.laboratorios l ON e.laboratorio_id = l.id
  ORDER BY c.created_at DESC;
$$;

-- Habilitar realtime para todas as tabelas principais
ALTER PUBLICATION supabase_realtime ADD TABLE public.coletas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.favoritos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.laboratorios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.embarcacoes;
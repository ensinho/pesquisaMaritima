-- Create laboratorios table
CREATE TABLE public.laboratorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  descricao TEXT,
  cargo TEXT,
  status BOOLEAN DEFAULT true,
  foto_perfil TEXT,
  laboratorio_id UUID REFERENCES public.laboratorios(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for security
CREATE TYPE public.app_role AS ENUM ('admin', 'researcher');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'researcher',
  UNIQUE(user_id, role)
);

-- Create embarcacoes table
CREATE TABLE public.embarcacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  laboratorio_id UUID REFERENCES public.laboratorios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coletas table
CREATE TABLE public.coletas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cientifico TEXT,
  nome_comum TEXT,
  data DATE NOT NULL,
  local TEXT,
  comprimento DECIMAL(10, 2),
  peso DECIMAL(10, 2),
  foto_1 TEXT,
  foto_2 TEXT,
  foto_3 TEXT,
  embarcacao_id UUID REFERENCES public.embarcacoes(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favoritos table
CREATE TABLE public.favoritos (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coleta_id UUID REFERENCES public.coletas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, coleta_id)
);

-- Enable RLS
ALTER TABLE public.laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embarcacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for laboratorios
CREATE POLICY "Anyone can view laboratorios" ON public.laboratorios FOR SELECT USING (true);
CREATE POLICY "Admins can insert laboratorios" ON public.laboratorios FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update laboratorios" ON public.laboratorios FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Roles are viewable by the user" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for embarcacoes
CREATE POLICY "Anyone can view embarcacoes" ON public.embarcacoes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create embarcacoes" ON public.embarcacoes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update embarcacoes" ON public.embarcacoes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coletas
CREATE POLICY "Anyone can view coletas" ON public.coletas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create coletas" ON public.coletas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own coletas" ON public.coletas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own coletas" ON public.coletas FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for favoritos
CREATE POLICY "Users can view their own favoritos" ON public.favoritos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own favoritos" ON public.favoritos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favoritos" ON public.favoritos FOR DELETE USING (auth.uid() = user_id);

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email
  );
  
  -- Add default researcher role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'researcher');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_coletas
  BEFORE UPDATE ON public.coletas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile-photos', 'profile-photos', true),
  ('coleta-photos', 'coleta-photos', true)
ON CONFLICT DO NOTHING;

-- Storage policies for profile photos
CREATE POLICY "Public profile photos access" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Users can upload their profile photo" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update their profile photo" ON storage.objects FOR UPDATE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete their profile photo" ON storage.objects FOR DELETE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for coleta photos
CREATE POLICY "Public coleta photos access" ON storage.objects FOR SELECT USING (bucket_id = 'coleta-photos');
CREATE POLICY "Authenticated users can upload coleta photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'coleta-photos' AND 
  auth.uid() IS NOT NULL
);
CREATE POLICY "Users can update coleta photos" ON storage.objects FOR UPDATE USING (bucket_id = 'coleta-photos');
CREATE POLICY "Users can delete coleta photos" ON storage.objects FOR DELETE USING (bucket_id = 'coleta-photos');
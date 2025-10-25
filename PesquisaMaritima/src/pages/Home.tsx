import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Plus, LogOut, Fish, Heart, User as UserIcon, Settings, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserStatistics from "@/components/UserStatistics";
import RecentCollections from "@/components/RecentCollections";
import { useColetasByUser } from "@/hooks/useColetas";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Buscar coletas do usuário
  const { data: coletas, isLoading: isLoadingColetas } = useColetasByUser(user?.id || "");

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // verifica se o usuário é admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      setIsAdmin(roles?.role === 'admin');
    };

    checkAuthAndRole();

    // escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session && event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Fish className="w-12 h-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-depth relative">

      {/* cabeçalho  */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Fish className="w-8 h-8 text-primary float-gentle" />
                <Waves className="w-8 h-8 text-primary/20 absolute top-0 left-0 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                  AquaCensus
                </h1>
                <p className="text-xs text-muted-foreground">Pesquisa Marítima</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/perfil")}
                className="hover:bg-primary/90 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
              </Button>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/admin")}
                  className="hover:bg-primary/90 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="hover:bg-primary/90 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* seção de boas-vindas com gradiente */}
          <div className="text-center space-y-4 py-8 relative">
            <div className="inline-block">
              <h2 className="text-4xl font-bold bg-gradient-wave bg-clip-text text-transparent mb-2">
                Bem-vindo, {user?.user_metadata?.nome || user?.email}!
              </h2>
              <div className="h-1 bg-gradient-ocean rounded-full shimmer" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Gerencie suas coletas de espécies marinhas e contribua para a pesquisa científica
            </p>
          </div>

          {/* estatísticas  */}
          {user && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-wave opacity-5 rounded-xl blur-3xl" />
              <UserStatistics userId={user.id} />
            </div>
          )}

          {/* ações rápidas */}
          <div className="grid md:grid-cols-3 gap-6">
            <Button
              size="lg"
              className="h-40 flex-col gap-3 relative overflow-hidden group bg-gradient-ocean hover:shadow-ocean transition-all duration-300"
              onClick={() => navigate("/nova-coleta")}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-semibold">Nova Coleta</span>
              <span className="text-xs opacity-90">Registre uma nova espécie</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-40 flex-col gap-3 relative overflow-hidden group hover:border-primary hover:bg-primary/70 transition-all duration-300"
              onClick={() => navigate("/catalogo")}
            >
              <Fish className="w-10 h-10 text-primary group-hover:scale-110 group-hover:text-white transition-transform float-gentle" />
              <span className="text-lg font-semibold">Ver Catálogo</span>
              <span className="text-xs text-muted-foreground group-hover:text-white">Explore todas as coletas</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-40 flex-col gap-3 relative overflow-hidden group hover:border-destructive hover:bg-destructive/70 transition-all duration-300"
              onClick={() => navigate("/favoritos")}
            >
              <Heart className="w-10 h-10 text-destructive group-hover:scale-110 group-hover:text-white transition-transform" />
              <span className="text-lg font-semibold">Favoritos</span>
              <span className="text-xs text-muted-foreground group-hover:text-white">Suas coletas favoritas</span>
            </Button>
          </div>

          {/* coletas recentes  */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border shadow-card p-6 hover:shadow-ocean transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-ocean rounded-full" />
                <h3 className="text-2xl font-semibold">Minhas Coletas Recentes</h3>
              </div>
              {coletas && coletas.length > 5 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/catalogo")}
                  className="text-primary hover:text-primary/80"
                >
                  Ver todas
                </Button>
              )}
            </div>
            <RecentCollections coletas={coletas || []} isLoading={isLoadingColetas} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

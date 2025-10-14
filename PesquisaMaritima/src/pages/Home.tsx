import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Plus, LogOut, Fish, Heart, User as UserIcon, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserStatistics from "@/components/UserStatistics";

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-screen bg-background">
      {/* cabeçalho */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fish className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">AquaCensus</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/perfil")}>
                <UserIcon className="w-5 h-5" />
              </Button>
              {isAdmin && (
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* seção de boas-vindas */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Bem-vindo, {user?.user_metadata?.nome || user?.email}!</h2>
            <p className="text-muted-foreground text-lg">
              Gerencie suas coletas de espécies marinhas
            </p>
          </div>

          {/* estatísticas */}
          {user && <UserStatistics userId={user.id} />}

          {/* ações rápidas */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              size="lg"
              className="h-32 flex-col gap-2"
              onClick={() => navigate("/nova-coleta")}
            >
              <Plus className="w-8 h-8" />
              <span>Nova Coleta</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-32 flex-col gap-2"
              onClick={() => navigate("/catalogo")}
            >
              <Fish className="w-8 h-8" />
              <span>Ver Catálogo</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-32 flex-col gap-2"
              onClick={() => navigate("/favoritos")}
            >
              <Heart className="w-8 h-8" />
              <span>Favoritos</span>
            </Button>
          </div>

          {/* prévia das coletas recentes */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Minhas Coletas Recentes</h3>
            <p className="text-muted-foreground text-center py-8">
              Suas coletas aparecerão aqui
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

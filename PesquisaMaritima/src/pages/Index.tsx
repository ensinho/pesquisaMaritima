import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fish, Database, Users, Image } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // redireciona automaticamente para a página de autenticação
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-6">
              <Fish className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AquaCensus
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema moderno de catalogação de espécies marinhas para pesquisadores do laboratório DIPEMAR
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card p-6 rounded-lg border">
              <Database className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Catálogo Centralizado</h3>
              <p className="text-sm text-muted-foreground">
                Todos os dados de coletas unificados em um único sistema
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <Image className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Registro com Fotos</h3>
              <p className="text-sm text-muted-foreground">
                Documente suas coletas com até 3 fotos por espécie
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Trabalho em Equipe</h3>
              <p className="text-sm text-muted-foreground">
                Colabore com outros pesquisadores do laboratório
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Começar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

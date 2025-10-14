import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useFavoritos, useToggleFavorito } from '@/hooks/useFavoritos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Fish } from 'lucide-react';

export default function Favorites() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  
  const { data: favoritos, isLoading } = useFavoritos(userId);
  const toggleFavorito = useToggleFavorito();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
      else navigate('/auth');
    });
  }, [navigate]);

  const handleRemoveFavorite = (coletaId: string) => {
    toggleFavorito.mutate({ 
      coletaId, 
      userId, 
      isFavorite: true 
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
          <div className="w-20" />
        </div>

        {isLoading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : favoritos && favoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((favorito: any) => {
              const coleta = favorito.coletas;
              return (
                <Card key={favorito.coleta_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    {coleta.foto_1 ? (
                      <img 
                        src={coleta.foto_1} 
                        alt={coleta.nome_comum || 'Espécie'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Fish className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => handleRemoveFavorite(coleta.id)}
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {coleta.nome_comum || 'Nome não informado'}
                    </CardTitle>
                    <p className="text-sm italic text-muted-foreground">
                      {coleta.nome_cientifico || 'Nome científico não informado'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Data:</strong> {new Date(coleta.data).toLocaleDateString('pt-BR')}</p>
                      {coleta.local && <p><strong>Local:</strong> {coleta.local}</p>}
                      {coleta.comprimento && <p><strong>Comprimento:</strong> {coleta.comprimento} cm</p>}
                      {coleta.peso && <p><strong>Peso:</strong> {coleta.peso} kg</p>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum favorito ainda</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/catalog')}
            >
              Explorar Catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

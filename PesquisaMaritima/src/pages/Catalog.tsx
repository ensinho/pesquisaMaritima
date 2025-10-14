import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useColetas } from '@/hooks/useColetas';
import { useFavoritos, useToggleFavorito } from '@/hooks/useFavoritos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, ArrowLeft, Search, Fish } from 'lucide-react';
import { toast } from 'sonner';

export default function Catalog() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: coletas, isLoading } = useColetas();
  const { data: favoritos } = useFavoritos(userId);
  const toggleFavorito = useToggleFavorito();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
      else navigate('/auth');
    });
  }, [navigate]);

  const isFavorite = (coletaId: string) => {
    return favoritos?.some(fav => fav.coleta_id === coletaId);
  };

  const handleToggleFavorite = (coletaId: string) => {
    if (!userId) {
      toast.error('Você precisa estar logado');
      return;
    }
    toggleFavorito.mutate({ 
      coletaId, 
      userId, 
      isFavorite: isFavorite(coletaId) 
    });
  };

  const filteredColetas = coletas?.filter(coleta => 
    coleta.nome_cientifico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coleta.nome_comum?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coleta.local?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Catálogo de Espécies</h1>
          <div className="w-20" />
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome científico, comum ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : filteredColetas && filteredColetas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColetas.map((coleta) => (
              <Card key={coleta.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    onClick={() => handleToggleFavorite(coleta.id)}
                  >
                    <Heart 
                      className={`h-5 w-5 ${isFavorite(coleta.id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Fish className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma coleta encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

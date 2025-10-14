import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    descricao: '',
    cargo: '',
  });

  const { data: profile, isLoading } = useProfile(userId);
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
      else navigate('/auth');
    });
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        descricao: profile.descricao || '',
        cargo: profile.cargo || '',
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ userId, updates: formData });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado com sucesso');
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>{profile?.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">{profile?.cargo || 'Cargo não informado'}</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              {profile?.laboratorios && (
                <div>
                  <Label>Laboratório</Label>
                  <Input
                    value={profile.laboratorios.nome}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={updateProfile.isPending}>
                      Salvar
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

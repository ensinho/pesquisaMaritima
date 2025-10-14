import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLaboratorios, useCreateLaboratorio } from '@/hooks/useLaboratorios';
import { useEmbarcacoes, useCreateEmbarcacao } from '@/hooks/useEmbarcacoes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Building2, Ship } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newLab, setNewLab] = useState('');
  const [newVessel, setNewVessel] = useState({ tipo: '', laboratorio_id: '' });

  const { data: laboratorios } = useLaboratorios();
  const { data: embarcacoes } = useEmbarcacoes();
  const createLaboratorio = useCreateLaboratorio();
  const createEmbarcacao = useCreateEmbarcacao();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roles?.role !== 'admin') {
        toast.error('Acesso negado: apenas administradores');
        navigate('/home');
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [navigate]);

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLab.trim()) {
      toast.error('Nome do laboratório é obrigatório');
      return;
    }
    createLaboratorio.mutate({ nome: newLab });
    setNewLab('');
  };

  const handleCreateVessel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVessel.tipo.trim()) {
      toast.error('Tipo de embarcação é obrigatório');
      return;
    }
    createEmbarcacao.mutate({
      tipo: newVessel.tipo,
      laboratorio_id: newVessel.laboratorio_id || undefined,
    });
    setNewVessel({ tipo: '', laboratorio_id: '' });
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Verificando permissões...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="w-20" />
        </div>

        <Tabs defaultValue="labs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="labs">Laboratórios</TabsTrigger>
            <TabsTrigger value="vessels">Embarcações</TabsTrigger>
          </TabsList>

          <TabsContent value="labs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Novo Laboratório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateLab} className="space-y-4">
                  <div>
                    <Label htmlFor="lab-name">Nome do Laboratório</Label>
                    <Input
                      id="lab-name"
                      value={newLab}
                      onChange={(e) => setNewLab(e.target.value)}
                      placeholder="Ex: DIPEMAR"
                    />
                  </div>
                  <Button type="submit" disabled={createLaboratorio.isPending}>
                    Criar Laboratório
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Laboratórios Cadastrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {laboratorios && laboratorios.length > 0 ? (
                  <div className="space-y-2">
                    {laboratorios.map((lab) => (
                      <div key={lab.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{lab.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(lab.created_at!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum laboratório cadastrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vessels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Embarcação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateVessel} className="space-y-4">
                  <div>
                    <Label htmlFor="vessel-type">Tipo de Embarcação</Label>
                    <Input
                      id="vessel-type"
                      value={newVessel.tipo}
                      onChange={(e) => setNewVessel({ ...newVessel, tipo: e.target.value })}
                      placeholder="Ex: Barco de Pesca"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vessel-lab">Laboratório (Opcional)</Label>
                    <Select
                      value={newVessel.laboratorio_id}
                      onValueChange={(value) => setNewVessel({ ...newVessel, laboratorio_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um laboratório" />
                      </SelectTrigger>
                      <SelectContent>
                        {laboratorios?.map((lab) => (
                          <SelectItem key={lab.id} value={lab.id}>
                            {lab.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={createEmbarcacao.isPending}>
                    Criar Embarcação
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  Embarcações Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {embarcacoes && embarcacoes.length > 0 ? (
                  <div className="space-y-2">
                    {embarcacoes.map((vessel: any) => (
                      <div key={vessel.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{vessel.tipo}</p>
                        <p className="text-sm text-muted-foreground">
                          {vessel.laboratorios ? `Lab: ${vessel.laboratorios.nome}` : 'Sem laboratório'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma embarcação cadastrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

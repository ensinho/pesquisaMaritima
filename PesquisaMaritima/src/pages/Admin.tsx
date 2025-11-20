import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLaboratorios, useCreateLaboratorio } from '@/hooks/useLaboratorios';
import { useEmbarcacoes, useCreateEmbarcacao, useDeleteEmbarcacao } from '@/hooks/useEmbarcacoes';
import { useUsers, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/useUsers';
import { useAdminColetas, useAdminDeleteColeta } from '@/hooks/useAdminColetas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Building2, Ship, Edit, Trash2, Users, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner';
import EditEmbarcacaoModal from '@/components/EditEmbarcacaoModal';
import EditColetaModal from '@/components/EditColetaModal';
import ConfirmDelete from '@/components/ConfirmDelete';

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newLab, setNewLab] = useState('');
  const [newVessel, setNewVessel] = useState({ tipo: '', laboratorio_id: '' });
  const [editingEmbarcacao, setEditingEmbarcacao] = useState<any>(null);
  const [deletingEmbarcacao, setDeletingEmbarcacao] = useState<any>(null);
  const [editingColeta, setEditingColeta] = useState<any>(null);
  const [deletingColeta, setDeletingColeta] = useState<any>(null);
  const [filterResearcher, setFilterResearcher] = useState<string>('all');

  const { data: laboratorios } = useLaboratorios();
  const { data: embarcacoes } = useEmbarcacoes();
  const { data: users, refetch: refetchUsers } = useUsers();
  const { data: allColetas, refetch: refetchColetas } = useAdminColetas();
  
  const createLaboratorio = useCreateLaboratorio();
  const createEmbarcacao = useCreateEmbarcacao();
  const deleteEmbarcacao = useDeleteEmbarcacao();
  const updateUserStatus = useUpdateUserStatus();
  const updateUserRole = useUpdateUserRole();
  const deleteColeta = useAdminDeleteColeta();

  // Filter collections by researcher
  const filteredColetas = filterResearcher === 'all' 
    ? allColetas 
    : allColetas?.filter(c => c.user_id === filterResearcher);

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

  const handleDeleteEmbarcacao = () => {
    if (!deletingEmbarcacao) return;
    
    deleteEmbarcacao.mutate(deletingEmbarcacao.id, {
      onSuccess: () => {
        setDeletingEmbarcacao(null);
      }
    });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    updateUserStatus.mutate(
      { userId, status: !currentStatus },
      { onSuccess: () => refetchUsers() }
    );
  };

  const handleDeleteColeta = () => {
    if (!deletingColeta) return;
    
    deleteColeta.mutate(deletingColeta.id, {
      onSuccess: () => {
        setDeletingColeta(null);
        refetchColetas();
      }
    });
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Verificando permissões...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="w-20" />
        </div>

        <Tabs defaultValue="labs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="labs">Laboratórios</TabsTrigger>
            <TabsTrigger value="vessels">Embarcações</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="collections">Coletas</TabsTrigger>
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
                      <div key={vessel.id} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{vessel.tipo}</p>
                          <p className="text-sm text-muted-foreground">
                            {vessel.laboratorios ? `Lab: ${vessel.laboratorios.nome}` : 'Sem laboratório'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEmbarcacao(vessel)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingEmbarcacao(vessel)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma embarcação cadastrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciar Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users && users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Laboratório</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.nome}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.laboratorios?.nome || 'Sem laboratório'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status ? 'default' : 'secondary'}>
                              {user.status ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                            >
                              {user.status ? 'Desativar' : 'Ativar'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Gerenciar Coletas
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={filterResearcher} onValueChange={setFilterResearcher}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrar por pesquisador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredColetas && filteredColetas.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Espécie</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Local</TableHead>
                        <TableHead>Pesquisador</TableHead>
                        <TableHead>Laboratório</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredColetas.map((coleta) => (
                        <TableRow key={coleta.id}>
                          <TableCell className="font-medium">
                            {coleta.nome_cientifico || coleta.nome_comum || 'Não especificado'}
                          </TableCell>
                          <TableCell>
                            {new Date(coleta.data).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>{coleta.local || 'Não especificado'}</TableCell>
                          <TableCell>{coleta.profiles?.nome || 'Desconhecido'}</TableCell>
                          <TableCell>
                            {coleta.profiles?.laboratorios?.nome || 'Sem laboratório'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingColeta(coleta)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingColeta(coleta)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">Nenhuma coleta encontrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modais */}
        {editingEmbarcacao && (
          <EditEmbarcacaoModal
            isOpen={!!editingEmbarcacao}
            onClose={() => setEditingEmbarcacao(null)}
            embarcacao={editingEmbarcacao}
          />
        )}

        {editingColeta && (
          <EditColetaModal
            isOpen={!!editingColeta}
            onClose={() => {
              setEditingColeta(null);
              refetchColetas();
            }}
            coleta={editingColeta}
            isAdmin={true}
          />
        )}

        {deletingEmbarcacao && (
          <ConfirmDelete
            isOpen={!!deletingEmbarcacao}
            onClose={() => setDeletingEmbarcacao(null)}
            onConfirm={handleDeleteEmbarcacao}
            title="Excluir Embarcação"
            description={`Tem certeza que deseja excluir a embarcação "${deletingEmbarcacao.tipo}"? Esta ação não pode ser desfeita.`}
            isLoading={deleteEmbarcacao.isPending}
          />
        )}

        {deletingColeta && (
          <ConfirmDelete
            isOpen={!!deletingColeta}
            onClose={() => setDeletingColeta(null)}
            onConfirm={handleDeleteColeta}
            title="Excluir Coleta"
            description={`Tem certeza que deseja excluir esta coleta? Esta ação não pode ser desfeita.`}
            isLoading={deleteColeta.isPending}
          />
        )}
      </div>
    </div>
  );
}
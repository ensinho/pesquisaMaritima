import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLaboratorios, useCreateLaboratorio } from '@/hooks/useLaboratorios';
import { useEmbarcacoes, useCreateEmbarcacao, useDeleteEmbarcacao } from '@/hooks/useEmbarcacoes';
import { useUsers, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/useUsers';
import { useAdminColetas, useAdminDeleteColeta } from '@/hooks/useAdminColetas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Building2, Ship, Edit, Trash2, Users, FileText, Filter, ShieldCheck, BarChart3, Database } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/home')}
            className="mb-4 hover:bg-white/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
          
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Painel Administrativo</h1>
                <p className="text-blue-100 mt-1">
                  Gerencie laboratórios, embarcações, usuários e coletas do sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Laboratórios
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {laboratorios?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Embarcações
              </CardTitle>
              <Ship className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">
                {embarcacoes?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para coletas
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                {users?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Pesquisadores ativos
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Coletas
              </CardTitle>
              <Database className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {allColetas?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total no catálogo
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="labs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 p-1 h-auto">
            <TabsTrigger value="labs" className="flex items-center gap-2 py-3">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Laboratórios</span>
            </TabsTrigger>
            <TabsTrigger value="vessels" className="flex items-center gap-2 py-3">
              <Ship className="h-4 w-4" />
              <span className="hidden sm:inline">Embarcações</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 py-3">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2 py-3">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Coletas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="labs" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Adicionar Novo Laboratório
                </CardTitle>
                <CardDescription>
                  Cadastre laboratórios de pesquisa para organizar as coletas e pesquisadores
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateLab} className="space-y-4">
                  <div>
                    <Label htmlFor="lab-name" className="text-base">Nome do Laboratório</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Digite o nome completo ou sigla do laboratório
                    </p>
                    <Input
                      id="lab-name"
                      value={newLab}
                      onChange={(e) => setNewLab(e.target.value)}
                      placeholder="Ex: DIPEMAR - Divisão de Pesquisa Marinha"
                      className="text-base"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={createLaboratorio.isPending}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createLaboratorio.isPending ? "Criando..." : "Criar Laboratório"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Laboratórios Cadastrados
                </CardTitle>
                <CardDescription>
                  Lista de todos os laboratórios registrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {laboratorios && laboratorios.length > 0 ? (
                  <div className="grid gap-3">
                    {laboratorios.map((lab) => (
                      <div 
                        key={lab.id} 
                        className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{lab.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              Cadastrado em {new Date(lab.created_at!).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Nenhum laboratório cadastrado ainda</p>
                    <p className="text-sm text-muted-foreground">Adicione o primeiro laboratório usando o formulário acima</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vessels" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-cyan-600" />
                  Adicionar Nova Embarcação
                </CardTitle>
                <CardDescription>
                  Cadastre embarcações utilizadas nas expedições de coleta
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateVessel} className="space-y-4">
                  <div>
                    <Label htmlFor="vessel-type" className="text-base">Tipo de Embarcação</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Informe o tipo ou nome da embarcação
                    </p>
                    <Input
                      id="vessel-type"
                      value={newVessel.tipo}
                      onChange={(e) => setNewVessel({ ...newVessel, tipo: e.target.value })}
                      placeholder="Ex: Barco de Pesca, Lancha, Navio Oceanográfico"
                      className="text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vessel-lab" className="text-base">Laboratório (Opcional)</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Vincule a embarcação a um laboratório específico
                    </p>
                    <Select
                      value={newVessel.laboratorio_id}
                      onValueChange={(value) => setNewVessel({ ...newVessel, laboratorio_id: value })}
                    >
                      <SelectTrigger className="text-base">
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
                  <Button 
                    type="submit" 
                    disabled={createEmbarcacao.isPending}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createEmbarcacao.isPending ? "Criando..." : "Criar Embarcação"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-cyan-600" />
                  Embarcações Cadastradas
                </CardTitle>
                <CardDescription>
                  Lista de todas as embarcações disponíveis para expedições
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {embarcacoes && embarcacoes.length > 0 ? (
                  <div className="grid gap-3">
                    {embarcacoes.map((vessel: any) => (
                      <div 
                        key={vessel.id} 
                        className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-cyan-100 rounded-full p-2">
                              <Ship className="h-5 w-5 text-cyan-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">{vessel.tipo}</p>
                              <p className="text-sm text-muted-foreground">
                                {vessel.laboratorios ? (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {vessel.laboratorios.nome}
                                  </span>
                                ) : (
                                  'Sem laboratório vinculado'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingEmbarcacao(vessel)}
                              className="hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingEmbarcacao(vessel)}
                              className="text-destructive hover:bg-red-50 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Ship className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Nenhuma embarcação cadastrada ainda</p>
                    <p className="text-sm text-muted-foreground">Adicione a primeira embarcação usando o formulário acima</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription>
                  Controle de acesso e status dos pesquisadores do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {users && users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-teal-50/50">
                          <TableHead className="font-semibold">Nome</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Laboratório</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-teal-50/30">
                            <TableCell className="font-medium">{user.nome}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.laboratorios?.nome ? (
                                <Badge variant="outline" className="bg-blue-50">
                                  {user.laboratorios.nome}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Sem laboratório</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.status ? 'default' : 'secondary'}
                                className={user.status ? 'bg-green-600' : ''}
                              >
                                {user.status ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant={user.status ? 'destructive' : 'default'}
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
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Gerenciar Coletas
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Visualize e gerencie todas as coletas registradas no sistema
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterResearcher} onValueChange={setFilterResearcher}>
                      <SelectTrigger className="w-[220px] bg-white">
                        <SelectValue placeholder="Filtrar por pesquisador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os pesquisadores</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {filteredColetas && filteredColetas.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-50/50">
                          <TableHead className="font-semibold">Espécie</TableHead>
                          <TableHead className="font-semibold">Data</TableHead>
                          <TableHead className="font-semibold">Local</TableHead>
                          <TableHead className="font-semibold">Pesquisador</TableHead>
                          <TableHead className="font-semibold">Laboratório</TableHead>
                          <TableHead className="font-semibold text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredColetas.map((coleta) => (
                          <TableRow key={coleta.id} className="hover:bg-purple-50/30">
                            <TableCell className="font-medium">
                              {coleta.nome_cientifico || coleta.nome_comum || (
                                <span className="text-muted-foreground italic">Não especificado</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(coleta.data).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {coleta.local || (
                                <span className="text-muted-foreground italic">Não especificado</span>
                              )}
                            </TableCell>
                            <TableCell>{coleta.profiles?.nome || 'Desconhecido'}</TableCell>
                            <TableCell>
                              {coleta.profiles?.laboratorios?.nome ? (
                                <Badge variant="outline" className="bg-blue-50">
                                  {coleta.profiles.laboratorios.nome}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Sem laboratório</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingColeta(coleta)}
                                  className="hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeletingColeta(coleta)}
                                  className="text-destructive hover:bg-red-50 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      {filterResearcher === 'all' 
                        ? 'Nenhuma coleta encontrada' 
                        : 'Nenhuma coleta encontrada para este pesquisador'}
                    </p>
                  </div>
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
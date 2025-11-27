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
import { ArrowLeft, Plus, Building2, Ship, Edit, Trash2, Users, FileText, Filter, ShieldCheck, BarChart3, Database, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';
import EditEmbarcacaoModal from '@/components/EditEmbarcacaoModal';
import EditColetaModal from '@/components/EditColetaModal';
import ConfirmDelete from '@/components/ConfirmDelete';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  // Chart Data Preparation
  const monthlyData = allColetas ? (() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date()
    });

    return last6Months.map(date => {
      const monthKey = format(date, 'MMM', { locale: ptBR });
      const count = allColetas.filter(c => {
        const cDate = new Date(c.data);
        return cDate.getMonth() === date.getMonth() && cDate.getFullYear() === date.getFullYear();
      }).length;
      return { name: monthKey.charAt(0).toUpperCase() + monthKey.slice(1), coletas: count };
    });
  })() : [];

  const labData = allColetas ? (() => {
    const counts: Record<string, number> = {};
    allColetas.forEach(c => {
      const labName = c.profiles?.laboratorios?.nome || 'Sem Laboratório';
      counts[labName] = (counts[labName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  })() : [];

  const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#3b82f6', '#6366f1'];

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
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/home')}
              className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Painel Administrativo</h1>
            <p className="text-slate-500 mt-1">
              Visão geral e gerenciamento do sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-white">
              <ShieldCheck className="w-3 h-3 mr-2 text-blue-600" />
              Admin Logado
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-white">
              <Activity className="w-3 h-3 mr-2 text-green-600" />
              Sistema Ativo
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total de Coletas
              </CardTitle>
              <Database className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allColetas?.length || 0}</div>
              <p className="text-xs text-blue-100 mt-1">
                Registros no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Laboratórios
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{laboratorios?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Instituições parceiras
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Embarcações
              </CardTitle>
              <Ship className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{embarcacoes?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Frota disponível
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pesquisadores
              </CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{users?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Usuários cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Evolução das Coletas
              </CardTitle>
              <CardDescription>
                Quantidade de coletas realizadas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorColetas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="coletas" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorColetas)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-600" />
                Top Laboratórios
              </CardTitle>
              <CardDescription>
                Distribuição por instituição
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={labData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {labData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="collections" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white border shadow-sm p-1 h-auto">
              <TabsTrigger value="collections" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Coletas
              </TabsTrigger>
              <TabsTrigger value="labs" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Laboratórios
              </TabsTrigger>
              <TabsTrigger value="vessels" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Embarcações
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Usuários
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="labs" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border-none shadow-sm h-fit">
                <CardHeader>
                  <CardTitle className="text-base">Novo Laboratório</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateLab} className="space-y-4">
                    <div>
                      <Label htmlFor="lab-name">Nome</Label>
                      <Input
                        id="lab-name"
                        value={newLab}
                        onChange={(e) => setNewLab(e.target.value)}
                        placeholder="Ex: DIPEMAR"
                        className="mt-1.5"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={createLaboratorio.isPending}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Laboratórios Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {laboratorios?.map((lab) => (
                      <div 
                        key={lab.id} 
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-700">{lab.nome}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(lab.created_at!).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    ))}
                    {(!laboratorios || laboratorios.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum laboratório cadastrado
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vessels" className="space-y-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border-none shadow-sm h-fit">
                <CardHeader>
                  <CardTitle className="text-base">Nova Embarcação</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateVessel} className="space-y-4">
                    <div>
                      <Label htmlFor="vessel-type">Tipo/Nome</Label>
                      <Input
                        id="vessel-type"
                        value={newVessel.tipo}
                        onChange={(e) => setNewVessel({ ...newVessel, tipo: e.target.value })}
                        placeholder="Ex: Barco de Pesca"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vessel-lab">Laboratório</Label>
                      <Select
                        value={newVessel.laboratorio_id}
                        onValueChange={(value) => setNewVessel({ ...newVessel, laboratorio_id: value })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Selecione..." />
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
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Frota Disponível</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {embarcacoes?.map((vessel: any) => (
                      <div 
                        key={vessel.id} 
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Ship className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">{vessel.tipo}</p>
                            <p className="text-xs text-muted-foreground">
                              {vessel.laboratorios?.nome || 'Sem vínculo'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingEmbarcacao(vessel)}
                            className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingEmbarcacao(vessel)}
                            className="h-8 w-8 text-slate-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="animate-in fade-in-50 duration-500">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Gerenciar Usuários</CardTitle>
                <CardDescription>Controle de acesso e permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Laboratório</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.nome}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.laboratorios?.nome ? (
                            <Badge variant="secondary" className="font-normal">
                              {user.laboratorios.nome}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status ? 'default' : 'secondary'}
                            className={user.status ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            {user.status ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                            className={user.status ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                          >
                            {user.status ? 'Desativar' : 'Ativar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="animate-in fade-in-50 duration-500">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Registro de Coletas</CardTitle>
                  <CardDescription>Histórico completo do sistema</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterResearcher} onValueChange={setFilterResearcher}>
                    <SelectTrigger className="w-[200px] h-9">
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
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Espécie</TableHead>
                      <TableHead>Data/Local</TableHead>
                      <TableHead>Pesquisador</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColetas?.map((coleta) => (
                      <TableRow key={coleta.id}>
                        <TableCell>
                          <div className="font-medium">
                            {coleta.nome_cientifico || coleta.nome_comum || 'Não identificado'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {coleta.nome_comum}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(coleta.data).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {coleta.local || 'Local n/a'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{coleta.profiles?.nome || 'Desconhecido'}</span>
                            {coleta.profiles?.laboratorios?.nome && (
                              <Badge variant="outline" className="text-[10px] h-5">
                                {coleta.profiles.laboratorios.nome}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingColeta(coleta)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingColeta(coleta)}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
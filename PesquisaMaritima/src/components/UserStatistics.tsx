import { useUserStatistics } from '@/hooks/useStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserStatisticsProps {
  userId: string;
}

const UserStatistics = ({ userId }: UserStatisticsProps) => {
  const { data: stats, isLoading } = useUserStatistics(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Coletas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_coletas}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_favoritos}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Espécies Únicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.especies_unicas}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Última Coleta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {stats.ultima_coleta 
              ? new Date(stats.ultima_coleta).toLocaleDateString('pt-BR')
              : 'Nenhuma coleta'
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatistics;

import { useUserStatistics } from '@/hooks/useStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Fish, Heart, Sparkles, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserStatisticsProps {
  userId: string;
}

const UserStatistics = ({ userId }: UserStatisticsProps) => {
  const { data: stats, isLoading } = useUserStatistics(userId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statsData = [
    {
      title: 'Total de Coletas',
      value: stats.total_coletas,
      icon: Fish,
      iconColor: 'text-white',
      bgColor: 'bg-primary',
      bgHover: 'group-hover:bg-primary/90'
    },
    {
      title: 'Total de Favoritos',
      value: stats.total_favoritos,
      icon: Heart,
      iconColor: 'text-white',
      bgColor: 'bg-destructive',  
      bgHover: 'group-hover:bg-destructive/90'
    },
    {
      title: 'Espécies Únicas',
      value: stats.especies_unicas,
      icon: Sparkles,
      iconColor: 'text-white',
      bgColor: 'bg-accent',  
      bgHover: 'group-hover:bg-accent/90'
    },
    {
      title: 'Última Coleta',
      value: stats.ultima_coleta 
        ? format(new Date(stats.ultima_coleta), "dd 'de' MMM", { locale: ptBR })
        : 'Nenhuma',
      icon: Calendar,
      iconColor: 'text-white',
      bgColor: 'bg-secondary', 
      bgHover: 'group-hover:bg-secondary/90'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className="group overflow-hidden hover:shadow-ocean transition-all duration-300 border-primary/10 hover:border-primary/30 border-primary/20"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center justify-between">
                <span>{stat.title}</span>
                
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} ${stat.bgHover} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent" style={{
                  backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--primary) / 0.7))`
                }}>
                  {stat.value}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserStatistics;


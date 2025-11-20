import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Fish, MapPin, Calendar, Ruler, Weight, User, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import { IColeta } from '@/services/api';

type Coleta = Tables<"coletas">;

interface RecentCollectionsProps {
  coletas: IColeta[];
  isLoading: boolean;
  showResearcherInfo?: boolean;
}

const RecentCollections = ({ coletas, isLoading, showResearcherInfo = false }: RecentCollectionsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!coletas || coletas.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Fish className="w-16 h-16 text-muted-foreground/20" />
            <div className="absolute inset-0 animate-ping">
              <Fish className="w-16 h-16 text-primary/20" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            Nenhuma coleta registrada ainda
          </p>
          <p className="text-sm text-muted-foreground/70">
            Comece sua jornada de pesquisa registrando sua primeira coleta!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {coletas.slice(0, 5).map((coleta) => (
        <Card 
          key={coleta.id} 
          className="group overflow-hidden hover:shadow-ocean transition-all duration-300 hover:border-primary/20"
        >
          <CardContent className="p-0">
            <div className="flex gap-0 md:gap-4 flex-col md:flex-row">
              {/* Imagem da coleta */}
              <div className="relative w-full md:w-32 h-32 bg-gradient-ocean overflow-hidden">
                {coleta.foto_1 ? (
                  <img
                    src={coleta.foto_1}
                    alt={coleta.nome_comum || coleta.nome_cientifico || "Espécie"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Fish className="w-12 h-12 text-white/50 float-gentle" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Informações da coleta */}
              <div className="flex-1 p-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {coleta.nome_comum || coleta.nome_cientifico || "Espécie não identificada"}
                    </h4>
                    {coleta.nome_comum && coleta.nome_cientifico && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        Catalogada
                      </Badge>
                    )}
                  </div>
                  {coleta.nome_comum && coleta.nome_cientifico && (
                    <p className="text-sm text-muted-foreground italic">
                      {coleta.nome_cientifico}
                    </p>
                  )}
                  
                  {/* Informações do pesquisador (apenas para admin) */}
                  {showResearcherInfo && coleta.profiles && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/20 px-2 py-1 rounded-md">
                        <User className="w-3.5 h-3.5 text-primary/70" />
                        <span className="font-medium">{coleta.profiles.nome}</span>
                      </div>
                      {coleta.profiles.laboratorios && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-accent/20 px-2 py-1 rounded-md">
                          <Building2 className="w-3.5 h-3.5 text-accent/70" />
                          <span>{coleta.profiles.laboratorios.nome}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {coleta.data && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span className="truncate">
                        {format(new Date(coleta.data), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  
                  {coleta.local && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent/70" />
                      <span className="truncate">{coleta.local}</span>
                    </div>
                  )}
                  
                  {coleta.comprimento && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ruler className="w-4 h-4 text-secondary/70" />
                      <span>{coleta.comprimento} cm</span>
                    </div>
                  )}
                  
                  {coleta.peso && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Weight className="w-4 h-4 text-primary/70" />
                      <span>{coleta.peso} kg</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentCollections;

import { useState, useEffect } from 'react';
import { useUpdateColeta } from '@/hooks/useColetas';
import { useEmbarcacoes } from '@/hooks/useEmbarcacoes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Tables } from '@/integrations/supabase/types';

interface EditColetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  coleta: Tables<'coletas'>;
}

export default function EditColetaModal({ isOpen, onClose, coleta }: EditColetaModalProps) {
  const [formData, setFormData] = useState({
    nome_comum: '',
    nome_cientifico: '',
    data: new Date(),
    local: '',
    //latitude: '',
    //longitude: '',
    comprimento: '',
    peso: '',
    //observacoes: '',
    embarcacao_id: '',
    foto_1: '',
    foto_2: '',
    foto_3: ''
  });

  const { data: embarcacoes } = useEmbarcacoes();
  const updateColeta = useUpdateColeta();

  useEffect(() => {
    if (coleta && isOpen) {
      setFormData({
        nome_comum: coleta.nome_comum || '',
        nome_cientifico: coleta.nome_cientifico || '',
        data: new Date(coleta.data),
        local: coleta.local || '',
        //latitude: coleta.latitude?.toString() || '',
        //longitude: coleta.longitude?.toString() || '',
        comprimento: coleta.comprimento?.toString() || '',
        peso: coleta.peso?.toString() || '',
        //observacoes: coleta.observacoes || '',
        embarcacao_id: coleta.embarcacao_id || '',
        foto_1: coleta.foto_1 || '',
        foto_2: coleta.foto_2 || '',
        foto_3: coleta.foto_3 || ''
      });
    }
  }, [coleta, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      nome_comum: formData.nome_comum || null,
      nome_cientifico: formData.nome_cientifico || null,
      data: formData.data.toISOString().split('T')[0],
      local: formData.local || null,
      comprimento: formData.comprimento ? parseFloat(formData.comprimento) : null,
      peso: formData.peso ? parseFloat(formData.peso) : null,
      embarcacao_id: formData.embarcacao_id || null,
      foto_1: formData.foto_1 || null,
      foto_2: formData.foto_2 || null,
      foto_3: formData.foto_3 || null
    };

    updateColeta.mutate({ id: coleta.id, data: updateData }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Coleta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_comum">Nome Comum</Label>
              <Input
                id="nome_comum"
                value={formData.nome_comum}
                onChange={(e) => setFormData({ ...formData, nome_comum: e.target.value })}
                placeholder="Ex: Sardinha"
              />
            </div>
            <div>
              <Label htmlFor="nome_cientifico">Nome Científico</Label>
              <Input
                id="nome_cientifico"
                value={formData.nome_cientifico}
                onChange={(e) => setFormData({ ...formData, nome_cientifico: e.target.value })}
                placeholder="Ex: Sardinella brasiliensis"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data da Coleta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.data && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.data ? format(formData.data, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.data}
                    onSelect={(date) => date && setFormData({ ...formData, data: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="embarcacao">Embarcação</Label>
              <Select
                value={formData.embarcacao_id}
                onValueChange={(value) => setFormData({ ...formData, embarcacao_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma embarcação" />
                </SelectTrigger>
                <SelectContent>
                  {embarcacoes?.map((embarcacao: any) => (
                    <SelectItem key={embarcacao.id} value={embarcacao.id}>
                      {embarcacao.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="local">Local da Coleta</Label>
            <Input
              id="local"
              value={formData.local}
              onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              placeholder="Ex: Costa de Santos/SP"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="comprimento">Comprimento (cm)</Label>
              <Input
                id="comprimento"
                type="number"
                step="0.1"
                value={formData.comprimento}
                onChange={(e) => setFormData({ ...formData, comprimento: e.target.value })}
                placeholder="Ex: 15.5"
              />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                placeholder="Ex: 0.25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto_1">URL da Foto 1</Label>
            <Input
              id="foto_1"
              type="url"
              value={formData.foto_1}
              onChange={(e) => setFormData({ ...formData, foto_1: e.target.value })}
              placeholder="https://exemplo.com/foto1.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto_2">URL da Foto 2</Label>
            <Input
              id="foto_2"
              type="url"
              value={formData.foto_2}
              onChange={(e) => setFormData({ ...formData, foto_2: e.target.value })}
              placeholder="https://exemplo.com/foto2.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto_3">URL da Foto 3</Label>
            <Input
              id="foto_3"
              type="url"
              value={formData.foto_3}
              onChange={(e) => setFormData({ ...formData, foto_3: e.target.value })}
              placeholder="https://exemplo.com/foto3.jpg"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateColeta.isPending}>
              {updateColeta.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
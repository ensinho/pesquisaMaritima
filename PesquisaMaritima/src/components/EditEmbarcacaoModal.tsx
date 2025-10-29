import { useState, useEffect } from 'react';
import { useUpdateEmbarcacao } from '@/hooks/useEmbarcacoes';
import { useLaboratorios } from '@/hooks/useLaboratorios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tables } from '@/integrations/supabase/types';

interface EditEmbarcacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  embarcacao: Tables<'embarcacoes'>;
}

export default function EditEmbarcacaoModal({ isOpen, onClose, embarcacao }: EditEmbarcacaoModalProps) {
  const [formData, setFormData] = useState({
    tipo: '',
    laboratorio_id: ''
  });

  const { data: laboratorios } = useLaboratorios();
  const updateEmbarcacao = useUpdateEmbarcacao();

  useEffect(() => {
    if (embarcacao && isOpen) {
      setFormData({
        tipo: embarcacao.tipo || '',
        laboratorio_id: embarcacao.laboratorio_id || ''
      });
    }
  }, [embarcacao, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo.trim()) {
      return;
    }

    const updateData = {
      tipo: formData.tipo,
      laboratorio_id: formData.laboratorio_id || null
    };

    updateEmbarcacao.mutate({ id: embarcacao.id, data: updateData }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Embarcação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tipo">Tipo de Embarcação</Label>
            <Input
              id="tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              placeholder="Ex: Barco de Pesca"
              required
            />
          </div>

          <div>
            <Label htmlFor="laboratorio">Laboratório</Label>
            <Select
              value={formData.laboratorio_id}
              onValueChange={(value) => setFormData({ ...formData, laboratorio_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um laboratório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum laboratório</SelectItem>
                {laboratorios?.map((lab) => (
                  <SelectItem key={lab.id} value={lab.id}>
                    {lab.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateEmbarcacao.isPending}>
              {updateEmbarcacao.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
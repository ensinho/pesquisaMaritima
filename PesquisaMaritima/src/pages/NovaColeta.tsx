import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X } from "lucide-react";

interface Embarcacao {
  id: string;
  tipo: string;
}

const NovaColeta = () => {
  const [loading, setLoading] = useState(false);
  const [embarcacoes, setEmbarcacoes] = useState<Embarcacao[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadEmbarcacoes();
  }, []);

  const loadEmbarcacoes = async () => {
    const { data } = await supabase.from("embarcacoes").select("*");
    if (data) setEmbarcacoes(data);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 3) {
      toast({
        variant: "destructive",
        title: "Limite de fotos",
        description: "Você pode adicionar no máximo 3 fotos.",
      });
      return;
    }
    setPhotos([...photos, ...files].slice(0, 3));
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const uploadPhoto = async (file: File, userId: string, coletaId: string, index: number) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${coletaId}_${index}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('coleta-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('coleta-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado");

      // insere a coleta primeiro
      const { data: coleta, error: coletaError } = await supabase
        .from("coletas")
        .insert({
          nome_cientifico: formData.get("nome_cientifico") as string,
          nome_comum: formData.get("nome_comum") as string,
          data: formData.get("data") as string,
          local: formData.get("local") as string,
          comprimento: parseFloat(formData.get("comprimento") as string) || null,
          peso: parseFloat(formData.get("peso") as string) || null,
          embarcacao_id: formData.get("embarcacao_id") as string || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (coletaError) throw coletaError;

      // faz upload das fotos
      const photoUrls: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const url = await uploadPhoto(photos[i], user.id, coleta.id, i + 1);
        photoUrls.push(url);
      }

      // atualiza a coleta com as urls das fotos
      const updateData: any = {};
      photoUrls.forEach((url, index) => {
        updateData[`foto_${index + 1}`] = url;
      });

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from("coletas")
          .update(updateData)
          .eq("id", coleta.id);
      }

      toast({
        title: "Coleta registrada!",
        description: "Sua coleta foi salva com sucesso.",
      });

      navigate("/home");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar coleta",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Nova Coleta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_cientifico">Nome Científico</Label>
                  <Input
                    id="nome_cientifico"
                    name="nome_cientifico"
                    placeholder="Genus species"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_comum">Nome Comum</Label>
                  <Input
                    id="nome_comum"
                    name="nome_comum"
                    placeholder="Nome popular"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data da Coleta</Label>
                  <Input
                    id="data"
                    name="data"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    name="local"
                    placeholder="Localização"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="comprimento">Comprimento (cm)</Label>
                  <Input
                    id="comprimento"
                    name="comprimento"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    name="peso"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="embarcacao_id">Embarcação</Label>
                <Select name="embarcacao_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma embarcação" />
                  </SelectTrigger>
                  <SelectContent>
                    {embarcacoes.map((emb) => (
                      <SelectItem key={emb.id} value={emb.id}>
                        {emb.tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fotos (até 3)</Label>
                <div className="flex flex-wrap gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-accent">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                        multiple
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Coleta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NovaColeta;

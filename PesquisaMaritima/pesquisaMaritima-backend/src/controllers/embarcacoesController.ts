import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

class EmbarcacoesController {
  async getAll(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('embarcacoes')
        .select('*, laboratorios(nome)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving embarcacoes', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from('embarcacoes')
        .select('*, laboratorios(nome)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Embarcacao not found' });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving embarcacao', error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('embarcacoes')
        .insert([req.body])
        .select('*, laboratorios(nome)')
        .single();
      
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: 'Error creating embarcacao', error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from('embarcacoes')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, laboratorios(nome)')
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Embarcacao not found' });
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: 'Error updating embarcacao', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { error } = await supabase
        .from('embarcacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting embarcacao', error });
    }
  }
}

export default new EmbarcacoesController();
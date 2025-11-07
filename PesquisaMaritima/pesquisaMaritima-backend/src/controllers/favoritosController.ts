import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

class FavoritosController {
  async getByUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving favoritos', error });
    }
  }

  async check(req: Request, res: Response) {
    const { userId, coletaId } = req.params;
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('id')
        .eq('user_id', userId)
        .eq('coleta_id', coletaId)
        .maybeSingle();
      
      if (error) throw error;
      res.status(200).json({ isFavorite: !!data });
    } catch (error) {
      res.status(500).json({ message: 'Error checking favorito', error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .insert([req.body])
        .select()
        .single();
      
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: 'Error creating favorito', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { userId, coletaId } = req.params;
    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', userId)
        .eq('coleta_id', coletaId);
      
      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting favorito', error });
    }
  }
}

export default new FavoritosController();

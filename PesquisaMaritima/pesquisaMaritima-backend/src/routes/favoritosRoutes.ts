import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

router.get('/favoritos/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving favoritos', error });
  }
});

router.get('/favoritos/check/:userId/:coletaId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('user_id', req.params.userId)
      .eq('coleta_id', req.params.coletaId)
      .maybeSingle();
    
    if (error) throw error;
    res.status(200).json({ isFavorite: !!data });
  } catch (error) {
    res.status(500).json({ message: 'Error checking favorito', error });
  }
});

router.post('/favoritos', async (req, res) => {
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
});

router.delete('/favoritos/:userId/:coletaId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('user_id', req.params.userId)
      .eq('coleta_id', req.params.coletaId);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting favorito', error });
  }
});

export default router;

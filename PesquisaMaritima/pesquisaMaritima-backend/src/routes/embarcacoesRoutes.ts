import { Router } from 'express';
import embarcacoesController from '../controllers/embarcacoesController';

const router = Router();
router.get('/embarcacoes', embarcacoesController.getAll);
router.get('/embarcacoes/:id', embarcacoesController.getById);
router.post('/embarcacoes', embarcacoesController.create);
router.put('/embarcacoes/:id', embarcacoesController.update);
router.delete('/embarcacoes/:id', embarcacoesController.delete);
import { supabase } from '../config/supabase';

router.get('/embarcacoes/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('embarcacoes')
      .select('*, laboratorios(nome)')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving embarcacao', error });
  }
});

router.post('/embarcacoes', async (req, res) => {
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
});

router.put('/embarcacoes/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('embarcacoes')
      .update(req.body)
      .eq('id', req.params.id)
      .select('*, laboratorios(nome)')
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error updating embarcacao', error });
  }
});

router.delete('/embarcacoes/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('embarcacoes')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting embarcacao', error });
  }
});

export default router;

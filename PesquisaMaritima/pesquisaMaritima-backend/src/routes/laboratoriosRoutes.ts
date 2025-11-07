import { Router } from 'express';
import laboratoriosController from '../controllers/laboratoriosController';
import { supabase } from '../config/supabase';

const router = Router();

router.get('/laboratorios', laboratoriosController.getAll);
router.get('/laboratorios/:id', laboratoriosController.getById);
router.post('/laboratorios', laboratoriosController.create);
router.put('/laboratorios/:id', laboratoriosController.update);
router.delete('/laboratorios/:id', laboratoriosController.delete);
router.get('/laboratorios/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laboratorios')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving laboratorio', error });
  }
});

router.post('/laboratorios', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laboratorios')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error creating laboratorio', error });
  }
});

router.put('/laboratorios/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laboratorios')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error updating laboratorio', error });
  }
});

router.delete('/laboratorios/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('laboratorios')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting laboratorio', error });
  }
});

export default router;

import { Router } from 'express';
import coletasController from '../controllers/coletasController';
import laboratoriosController from '../controllers/laboratoriosController';
import embarcacoesController from '../controllers/embarcacoesController';
import favoritosController from '../controllers/favoritosController';

const router = Router();

// Rotas de Coletas
router.get('/coletas', coletasController.getAllColetas);
router.get('/coletas/user/:userId', coletasController.getColetasByUser);
router.get('/coletas/:id', coletasController.getColetaById);
router.post('/coletas', coletasController.createColeta);
router.put('/coletas/:id', coletasController.updateColeta);
router.delete('/coletas/:id', coletasController.deleteColeta);

// Rotas de Laboratórios
router.get('/laboratorios', laboratoriosController.getAll);
router.get('/laboratorios/:id', laboratoriosController.getById);
router.post('/laboratorios', laboratoriosController.create);
router.put('/laboratorios/:id', laboratoriosController.update);
router.delete('/laboratorios/:id', laboratoriosController.delete);

// Rotas de Embarcações
router.get('/embarcacoes', embarcacoesController.getAll);
router.get('/embarcacoes/:id', embarcacoesController.getById);
router.post('/embarcacoes', embarcacoesController.create);
router.put('/embarcacoes/:id', embarcacoesController.update);
router.delete('/embarcacoes/:id', embarcacoesController.delete);

// Rotas de Favoritos
router.get('/favoritos/user/:userId', favoritosController.getByUser);
router.get('/favoritos/check/:userId/:coletaId', favoritosController.check);
router.post('/favoritos', favoritosController.create);
router.delete('/favoritos/:userId/:coletaId', favoritosController.delete);

export default router;

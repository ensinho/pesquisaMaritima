import { Router } from 'express';
import coletasRoutes from './coletasRoutes';
import laboratoriosRoutes from './laboratoriosRoutes';
import embarcacoesRoutes from './embarcacoesRoutes';
import favoritosRoutes from './favoritosRoutes';
import usersRoutes from './usersRoutes';

const router = Router();

router.use(coletasRoutes);
router.use(laboratoriosRoutes);
router.use(embarcacoesRoutes);
router.use(favoritosRoutes);
router.use('/users', usersRoutes);

export default router;
import { Router } from 'express';
import usersController from '../controllers/usersController';

const router = Router();

// Get all users (excluding admins)
router.get('/', usersController.getAllUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Update user profile
router.put('/:id/profile', usersController.updateUserProfile);

// Update user role
router.put('/:id/role', usersController.updateUserRole);

// Update user status
router.put('/:id/status', usersController.updateUserStatus);

export default router;

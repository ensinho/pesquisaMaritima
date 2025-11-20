import { Request, Response } from 'express';
import User from '../models/User';

class UsersController {
  /**
   * Get all users (excluding admins)
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error });
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await User.updateProfile(id, req.body);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.message === 'Cannot modify admin users') {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: 'Error updating user profile', error });
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'researcher'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "admin" or "researcher"' });
    }

    try {
      await User.updateRole(id, role);
      const updatedUser = await User.findById(id);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.message === 'Cannot modify admin users') {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: 'Error updating user role', error });
    }
  }

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: 'Status must be a boolean value' });
    }

    try {
      const updatedUser = await User.updateStatus(id, status);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.message === 'Cannot modify admin users') {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: 'Error updating user status', error });
    }
  }
}

export default new UsersController();

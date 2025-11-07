import { Request, Response } from 'express';
import Coleta from '../models/Coleta';

class ColetasController {
  async getAllColetas(req: Request, res: Response) {
    try {
      const coletas = await Coleta.findAll();
      res.status(200).json(coletas);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving coletas', error });
    }
  }

  async getColetasByUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const coletas = await Coleta.findByUser(userId);
      res.status(200).json(coletas);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user coletas', error });
    }
  }

  async getColetaById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const coleta = await Coleta.findById(id);
      if (!coleta) {
        return res.status(404).json({ message: 'Coleta not found' });
      }
      res.status(200).json(coleta);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving coleta', error });
    }
  }

  async createColeta(req: Request, res: Response) {
    try {
      const newColeta = await Coleta.create(req.body);
      res.status(201).json(newColeta);
    } catch (error) {
      res.status(400).json({ message: 'Error creating coleta', error });
    }
  }

  async updateColeta(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedColeta = await Coleta.update(id, req.body);
      if (!updatedColeta) {
        return res.status(404).json({ message: 'Coleta not found' });
      }
      res.status(200).json(updatedColeta);
    } catch (error) {
      res.status(400).json({ message: 'Error updating coleta', error });
    }
  }

  async deleteColeta(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleted = await Coleta.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Coleta not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting coleta', error });
    }
  }
}

export default new ColetasController();
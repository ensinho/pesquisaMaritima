import { Request, Response } from 'express';
import Laboratorio from '../models/Laboratorio';

class LaboratoriosController {
  async getAll(req: Request, res: Response) {
    try {
      const laboratorios = await Laboratorio.findAll();
      res.status(200).json(laboratorios);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving laboratorios', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const laboratorio = await Laboratorio.findById(id);
      if (!laboratorio) {
        return res.status(404).json({ message: 'Laboratorio not found' });
      }
      res.status(200).json(laboratorio);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving laboratorio', error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newLaboratorio = await Laboratorio.create(req.body);
      res.status(201).json(newLaboratorio);
    } catch (error) {
      res.status(400).json({ message: 'Error creating laboratorio', error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updated = await Laboratorio.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Laboratorio not found' });
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Error updating laboratorio', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await Laboratorio.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting laboratorio', error });
    }
  }
}

export default new LaboratoriosController();
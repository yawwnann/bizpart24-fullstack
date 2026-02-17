import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import slugify from 'slugify';

export class ModelController {
  
  // Public
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const models = await prisma.model.findMany({
        orderBy: { name: 'asc' }
      });
      res.json({ success: true, count: models.length, data: models });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const model = await prisma.model.findUnique({
        where: { id }
      });
      if (!model) {
        return res.status(404).json({ success: false, message: 'Model not found' });
      }
      res.json({ success: true, data: model });
    } catch (error) {
      next(error);
    }
  };

  // Admin Only
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      
      if (!name) {
          return res.status(400).json({ success: false, message: 'Name is required' });
      }

      const slug = slugify(name, { lower: true, strict: true });

      const model = await prisma.model.create({
        data: {
          name,
          slug,
        }
      });

      res.status(201).json({ success: true, data: model });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ success: false, message: 'Model already exists' });
      }
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const id = String(req.params.id);

      const existing = await prisma.model.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Model not found' });
      }

      let data: any = {};
      if (name) {
          data.name = name;
          data.slug = slugify(name, { lower: true, strict: true });
      }

      const model = await prisma.model.update({
        where: { id },
        data
      });

      res.json({ success: true, data: model });
    } catch (error: any) {
       if (error.code === 'P2002') {
        return res.status(400).json({ success: false, message: 'Model with this name already exists' });
      }
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const existing = await prisma.model.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Model not found' });
      }

      await prisma.model.delete({
        where: { id }
      });

      res.json({ success: true, message: 'Model removed' });
    } catch (error) {
      next(error);
    }
  };
}

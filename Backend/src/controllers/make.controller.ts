import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import slugify from 'slugify';

export class MakeController {
  
  // Public
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const makes = await prisma.make.findMany({
        orderBy: { name: 'asc' }
      });
      res.json({ success: true, count: makes.length, data: makes });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const make = await prisma.make.findUnique({
        where: { id }
      });
      if (!make) {
        return res.status(404).json({ success: false, message: 'Make not found' });
      }
      res.json({ success: true, data: make });
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

      const make = await prisma.make.create({
        data: {
          name,
          slug,
        }
      });

      res.status(201).json({ success: true, data: make });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ success: false, message: 'Make already exists' });
      }
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const id = String(req.params.id);

      const existing = await prisma.make.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Make not found' });
      }

      let data: any = {};
      if (name) {
          data.name = name;
          data.slug = slugify(name, { lower: true, strict: true });
      }

      const make = await prisma.make.update({
        where: { id },
        data
      });

      res.json({ success: true, data: make });
    } catch (error: any) {
       if (error.code === 'P2002') {
        return res.status(400).json({ success: false, message: 'Make with this name already exists' });
      }
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const existing = await prisma.make.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Make not found' });
      }

      await prisma.make.delete({
        where: { id }
      });

      res.json({ success: true, message: 'Make removed' });
    } catch (error) {
      next(error);
    }
  };
}

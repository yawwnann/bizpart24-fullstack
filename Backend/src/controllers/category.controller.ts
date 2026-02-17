import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import slugify from 'slugify';

export class CategoryController {
  
  // Public
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
      res.json({ success: true, count: categories.length, data: categories });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const category = await prisma.category.findUnique({
        where: { id }
      });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.json({ success: true, data: category });
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

      const category = await prisma.category.create({
        data: {
          name,
          slug,
        }
      });

      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      if (error.code === 'P2002') { // Prisma unique constraint error
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const id = String(req.params.id);

      // Check if exists
      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      let data: any = {};
      if (name) {
          data.name = name;
          data.slug = slugify(name, { lower: true, strict: true });
      }

      const category = await prisma.category.update({
        where: { id },
        data
      });

      res.json({ success: true, data: category });
    } catch (error: any) {
       if (error.code === 'P2002') {
        return res.status(400).json({ success: false, message: 'Category with this name already exists' });
      }
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if exists
      const id = String(req.params.id);
      const existing = await prisma.category.findUnique({ where: { id } });
       if (!existing) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      await prisma.category.delete({
        where: { id }
      });

      res.json({ success: true, message: 'Category removed' });
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { uploadToCloudinary } from '../utils/cloudinary';

export class ProductController {
  // Public
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, make, model, year, search, page } = req.query;

      // Pagination setup
      const limit = 10; // Fixed limit
      const currentPage = parseInt(page as string) || 1;
      const skip = (currentPage - 1) * limit;

      let where: any = {};

      if (category) {
        where.category = {
          name: category as string
        };
      }
      if (make) {
        where.make = {
          name: { contains: make as string, mode: 'insensitive' }
        };
      }
      if (model) {
        where.model = {
          name: { contains: model as string, mode: 'insensitive' }
        };
      }
      if (year) {
        where.year = Number(year);
      }
      if (search) {
        where.name = { contains: search as string, mode: 'insensitive' };
      }

      // Get total count for pagination
      const total = await prisma.product.count({ where });

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          make: true,
          model: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      });
      
      // Transform data to match previous structure (flattening relations if needed, or keeping objects)
      // The frontend likely expects category, make, model as strings or objects.
      // Let's return them as objects, but if frontend breaks we might need to map them to strings.
      // For now, returning objects is better (more info).
      
      const formattedProducts = products.map((p: any) => ({
        ...p,
        category: p.category.name,
        make: p.make.name,
        model: p.model.name,
        categoryId: p.categoryId,
        makeId: p.makeId,
        modelId: p.modelId
      }));

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);

      res.json({ 
        success: true, 
        data: formattedProducts,
        pagination: {
          total,
          totalPages,
          currentPage,
          limit,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        }
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          make: true,
          model: true,
        }
      });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      const p = product as any;
      const formattedProduct = {
        ...product,
        category: p.category.name,
        make: p.make.name,
        model: p.model.name,
      };

      res.json({ success: true, data: formattedProduct });
    } catch (error) {
      next(error);
    }
  };

  // Admin Only
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, description, stock, category, make, model, year } = req.body;
      
      let imageUrl = '';
      if (req.file) {
        imageUrl = (await uploadToCloudinary(req.file.buffer, 'products')) as string;
      } else {
          return res.status(400).json({ success: false, message: 'Image is required' });
      }

      // Lookup Relations by Name
      const categoryDoc = await prisma.category.findUnique({ where: { name: category } });
      if (!categoryDoc) return res.status(400).json({ success: false, message: `Category '${category}' not found` });

      const makeDoc = await prisma.make.findUnique({ where: { name: make } });
      if (!makeDoc) return res.status(400).json({ success: false, message: `Make '${make}' not found` });

      const modelDoc = await prisma.model.findUnique({ where: { name: model } });
      if (!modelDoc) return res.status(400).json({ success: false, message: `Model '${model}' not found` });

      const product = await prisma.product.create({
        data: {
          name,
          price: Number(price),
          description,
          stock: Number(stock),
          year: Number(year),
          image: imageUrl,
          categoryId: categoryDoc.id,
          makeId: makeDoc.id,
          modelId: modelDoc.id
        }
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const { name, price, description, stock, category, make, model, year } = req.body;
      
      let imageUrl = product.image;
      if (req.file) {
        imageUrl = (await uploadToCloudinary(req.file.buffer, 'products')) as string;
      }

      let data: any = {
        name,
        price: Number(price),
        description,
        stock: Number(stock),
        year: Number(year),
        image: imageUrl
      };

      // Update relations if provided
      if (category) {
         const categoryDoc = await prisma.category.findUnique({ where: { name: category } });
         if (!categoryDoc) return res.status(400).json({ success: false, message: `Category '${category}' not found` });
         data.categoryId = categoryDoc.id;
      }
      if (make) {
         const makeDoc = await prisma.make.findUnique({ where: { name: make } });
         if (!makeDoc) return res.status(400).json({ success: false, message: `Make '${make}' not found` });
         data.makeId = makeDoc.id;
      }
      if (model) {
         const modelDoc = await prisma.model.findUnique({ where: { name: model } });
         if (!modelDoc) return res.status(400).json({ success: false, message: `Model '${model}' not found` });
         data.modelId = modelDoc.id;
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data
      });

      res.json({ success: true, data: updatedProduct });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if exists
      const id = String(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      await prisma.product.delete({ where: { id } });
      
      res.json({ success: true, message: 'Product removed' });
    } catch (error) {
      next(error);
    }
  };
}

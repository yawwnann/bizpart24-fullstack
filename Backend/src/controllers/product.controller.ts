import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { uploadToCloudinary } from "../utils/cloudinary";

export class ProductController {
  // Public
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        category,
        make,
        model,
        year,
        search,
        page,
        limit: limitParam,
        minPrice,
        maxPrice,
        sort,
      } = req.query;

      // Pagination setup
      const fetchAll = limitParam === "all";
      const limit = fetchAll ? undefined : parseInt(limitParam as string) || 12;
      const currentPage = parseInt(page as string) || 1;
      const skip = fetchAll ? undefined : (currentPage - 1) * (limit as number);

      let where: any = {};

      if (category) {
        where.category = {
          name: { equals: category as string, mode: "insensitive" },
        };
      }
      if (make) {
        where.make = {
          name: { contains: make as string, mode: "insensitive" },
        };
      }
      if (model) {
        where.model = {
          name: { contains: model as string, mode: "insensitive" },
        };
      }
      if (year) {
        where.year = Number(year);
      }
      if (search) {
        where.name = { contains: search as string, mode: "insensitive" };
      }

      // Price Range Filter
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      // Sorting Logic
      let orderBy: any = { createdAt: "desc" }; // Default newest
      if (sort) {
        switch (sort) {
          case "price_asc":
            orderBy = { price: "asc" };
            break;
          case "price_desc":
            orderBy = { price: "desc" };
            break;
          case "newest":
            orderBy = { createdAt: "desc" };
            break;
          case "oldest":
            orderBy = { createdAt: "asc" };
            break;
          case "name_asc":
            orderBy = { name: "asc" };
            break;
          case "name_desc":
            orderBy = { name: "desc" };
            break;
        }
      }

      // Get total count for pagination
      const total = await prisma.product.count({ where });

      const products = await prisma.product.findMany({
        where,
        include: {
          category: true,
          make: true,
          model: true,
          images: { orderBy: { order: "asc" } },
        },
        orderBy,
        ...(fetchAll ? {} : { skip, take: limit }),
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
        modelId: p.modelId,
        images: p.images || [],
      }));

      // Calculate pagination metadata
      const effectiveLimit = limit ?? total;
      const totalPages = Math.ceil(total / effectiveLimit);

      res.json({
        success: true,
        data: formattedProducts,
        pagination: {
          total,
          totalPages,
          currentPage,
          limit,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        },
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
          images: { orderBy: { order: "asc" } },
        },
      });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const p = product as any;
      const formattedProduct = {
        ...product,
        category: p.category.name,
        make: p.make.name,
        model: p.model.name,
        images: p.images || [],
      };

      res.json({ success: true, data: formattedProduct });
    } catch (error) {
      next(error);
    }
  };

  // Admin Only
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, description, stock, category, make, model, year } =
        req.body;

      // Handle files from multer .fields()
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      // Profile image (catalog thumbnail)
      let imageUrl = "";
      if (files?.profile && files.profile.length > 0) {
        imageUrl = (await uploadToCloudinary(
          files.profile[0].buffer,
          "products/profile",
        )) as string;
      } else if (req.file) {
        // Backward compat with single upload
        imageUrl = (await uploadToCloudinary(
          req.file.buffer,
          "products/profile",
        )) as string;
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Profile image is required" });
      }

      // Lookup Relations by Name
      const categoryDoc = await prisma.category.findUnique({
        where: { name: category },
      });
      if (!categoryDoc)
        return res.status(400).json({
          success: false,
          message: `Category '${category}' not found`,
        });

      const makeDoc = await prisma.make.findUnique({ where: { name: make } });
      if (!makeDoc)
        return res
          .status(400)
          .json({ success: false, message: `Make '${make}' not found` });

      const modelDoc = await prisma.model.findUnique({
        where: { name: model },
      });
      if (!modelDoc)
        return res
          .status(400)
          .json({ success: false, message: `Model '${model}' not found` });

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
          modelId: modelDoc.id,
        },
      });

      // Detail images (multiple)
      if (files?.details && files.details.length > 0) {
        const detailUploads = files.details.map(async (file, index) => {
          const url = (await uploadToCloudinary(
            file.buffer,
            "products/details",
          )) as string;
          return prisma.productImage.create({
            data: {
              url,
              order: index,
              productId: product.id,
            },
          });
        });
        await Promise.all(detailUploads);
      }

      // Return product with images
      const result = await prisma.product.findUnique({
        where: { id: product.id },
        include: { images: { orderBy: { order: "asc" } } },
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const {
        name,
        price,
        description,
        stock,
        category,
        make,
        model,
        year,
        deleteImageIds,
      } = req.body;

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      // Update profile image if new one uploaded
      let imageUrl = product.image;
      if (files?.profile && files.profile.length > 0) {
        imageUrl = (await uploadToCloudinary(
          files.profile[0].buffer,
          "products/profile",
        )) as string;
      } else if (req.file) {
        imageUrl = (await uploadToCloudinary(
          req.file.buffer,
          "products/profile",
        )) as string;
      }

      let data: any = {
        name,
        price: Number(price),
        description,
        stock: Number(stock),
        year: Number(year),
        image: imageUrl,
      };

      // Update relations if provided
      if (category) {
        const categoryDoc = await prisma.category.findUnique({
          where: { name: category },
        });
        if (!categoryDoc)
          return res.status(400).json({
            success: false,
            message: `Category '${category}' not found`,
          });
        data.categoryId = categoryDoc.id;
      }
      if (make) {
        const makeDoc = await prisma.make.findUnique({ where: { name: make } });
        if (!makeDoc)
          return res
            .status(400)
            .json({ success: false, message: `Make '${make}' not found` });
        data.makeId = makeDoc.id;
      }
      if (model) {
        const modelDoc = await prisma.model.findUnique({
          where: { name: model },
        });
        if (!modelDoc)
          return res
            .status(400)
            .json({ success: false, message: `Model '${model}' not found` });
        data.modelId = modelDoc.id;
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      });

      // Delete specified detail images
      if (deleteImageIds) {
        const idsToDelete = Array.isArray(deleteImageIds)
          ? deleteImageIds
          : JSON.parse(deleteImageIds);
        if (idsToDelete.length > 0) {
          await prisma.productImage.deleteMany({
            where: {
              id: { in: idsToDelete },
              productId: id,
            },
          });
        }
      }

      // Add new detail images
      if (files?.details && files.details.length > 0) {
        // Get current max order
        const lastImage = await prisma.productImage.findFirst({
          where: { productId: id },
          orderBy: { order: "desc" },
        });
        const startOrder = (lastImage?.order ?? -1) + 1;

        const detailUploads = files.details.map(async (file, index) => {
          const url = (await uploadToCloudinary(
            file.buffer,
            "products/details",
          )) as string;
          return prisma.productImage.create({
            data: {
              url,
              order: startOrder + index,
              productId: id,
            },
          });
        });
        await Promise.all(detailUploads);
      }

      // Return updated product with images
      const result = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          make: true,
          model: true,
          images: { orderBy: { order: "asc" } },
        },
      });

      res.json({ success: true, data: result });
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
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // ProductImage has onDelete: Cascade, so images are auto-deleted
      await prisma.product.delete({ where: { id } });

      res.json({ success: true, message: "Product removed" });
    } catch (error) {
      next(error);
    }
  };

  // Delete a single detail image
  public deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const imageId = String(req.params.imageId);
      const image = await prisma.productImage.findUnique({
        where: { id: imageId },
      });
      if (!image) {
        return res
          .status(404)
          .json({ success: false, message: "Image not found" });
      }

      await prisma.productImage.delete({ where: { id: imageId } });

      res.json({ success: true, message: "Image removed" });
    } catch (error) {
      next(error);
    }
  };
}

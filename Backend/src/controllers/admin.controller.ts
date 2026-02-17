import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AdminController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const admin = await prisma.admin.findUnique({ where: { email } });

      if (admin && (await bcrypt.compare(password, admin.password))) {
        res.json({
          success: true,
          token: jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
          ),
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
      // Temporary endpoint to create first admin
      try {
          const { email, password } = req.body;
          const adminExists = await prisma.admin.findUnique({ where: { email } });
          
          if (adminExists) {
              return res.status(400).json({ success: false, message: 'Admin already exists' });
          }

          // Hash password explicitly since no Mongoose pre-save hook
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const admin = await prisma.admin.create({
            data: {
              email,
              password: hashedPassword
            }
          });
          
           res.status(201).json({
              success: true,
              data: {
                  id: admin.id,
                  email: admin.email
              }
          });
      } catch (error) {
          next(error);
      }
  }
}

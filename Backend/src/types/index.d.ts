import 'express';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: Multer.File;
    }
  }
}

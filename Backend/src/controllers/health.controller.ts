import { Request, Response, NextFunction } from 'express';

export class HealthController {
  public check = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File terlalu besar. Maksimal 1MB per file.";
  } else if (err.code === "LIMIT_FILE_COUNT") {
    statusCode = 400;
    message = "Terlalu banyak file. Maksimal 10 file detail.";
  } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Field file tidak valid.";
  } else if (err.message === "Not an image! Please upload an image.") {
    statusCode = 400;
    message = "File harus berupa gambar (JPG, PNG, GIF, dll).";
  }

  console.error(`[Error] ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json({ err });
  }

  return res.status(500).json({ err });
};

export default errorHandler;

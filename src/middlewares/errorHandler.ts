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
  if (process.env.NODE_ENV === 'production') {
    console.error(err);
  }

  if (err.status) {
    return res
      .status(err.status)
      .json({ status: err.status, message: err.message });
  }

  return res.status(500).json({ status: 500, message: 'Something went wrong' });
};

export default errorHandler;

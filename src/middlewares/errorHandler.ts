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

  if (process.env.NODE_ENV === 'production') {
    return res
      .status(500)
      .json({ status: 500, message: 'Something went wrong' });
  }

  if (err.status) {
    return res.status(err.status).json(err);
  }

  return res.status(500).json(err);
};

export default errorHandler;

// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import { Color } from '@prisma/client';

const colorController = {
  getColors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const colors: Color[] = await prisma.color.findMany();
      res.status(200).json(colors);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default colorController;

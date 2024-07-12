// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';

const colorController = {
  getColors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const colors = await prisma.color.findMany();
      res.status(200).json(colors);
    } catch (error) {
      next(error);
    }
  },
};

export default colorController;

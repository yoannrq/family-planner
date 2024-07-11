// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';

const groupController = {
  getGroups: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userEmail = req.user.email;

    try {
      const groups = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          groups: true,
        },
      });

      if (!groups) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(groups);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default groupController;

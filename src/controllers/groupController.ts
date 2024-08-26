// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import groupSchema from '../utils/validations/groupSchema.js';

const groupController = {
  getGroups: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;

    try {
      const userGroups = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          groups: true,
        },
      });

      if (!userGroups) {
        return next({
          status: 404,
          message: 'User not found',
        });
      }

      return res.status(200).json(userGroups.groups);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  createGroup: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;

    const { success, data, error } = groupSchema.safeParse(req.body);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    try {
      const newGroup = await prisma.group.create({
        data: {
          name: data.name,
          colorId: data.colorId,
          users: {
            connect: {
              email: userEmail,
            },
          },
        },
      });

      return res.status(201).json(newGroup);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default groupController;

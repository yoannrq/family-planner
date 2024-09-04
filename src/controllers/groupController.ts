// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import { Group, Prisma } from '@prisma/client';
import { GroupInput, groupSchema } from '../utils/validations/groupSchema.js';

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
      const userWithGroups = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          groups: true,
        },
      });

      if (!userWithGroups) {
        return next({
          status: 404,
          message: 'User not found',
        });
      }

      const userGroups: Group[] = userWithGroups.groups;

      return res.status(200).json(userGroups);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  getGroupByIdWithUsers: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;
    const groupId = parseInt(req.params.groupId);

    try {
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          users: true,
        },
      });

      if (!group) {
        return next({
          status: 404,
          message: 'Group not found',
        });
      }

      const userIsMember = group.users.find((user) => user.email === userEmail);

      if (!userIsMember) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      return res.status(200).json(group);
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
    const groupInput: GroupInput = req.body;

    const { success, data, error } = groupSchema.safeParse(groupInput);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    try {
      const currentUser = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!currentUser) {
        return next({
          status: 404,
          message: 'User not found',
        });
      }

      const newGroup: Group = await prisma.group.create({
        data: {
          name: data.name,
          colorId: data.colorId,
          users: {
            connect: {
              email: userEmail,
            },
          },
          ownerId: currentUser?.id,
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

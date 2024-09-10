// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import { Group, User } from '@prisma/client';
import { GroupInput, groupSchema } from '../utils/validations/groupSchema.js';
import { GroupWithUsers, UserWithGroups } from '../../types/prisma-types.js';
import randomizer from '../utils/randomizer.js';

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
        include: {
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
      const currentUser: User | null = await prisma.user.findUnique({
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

  updateGroup: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const groupId = parseInt(req.params.groupId);
    const groupInput: Partial<GroupInput> = req.body;

    const { success, data, error } = groupSchema
      .partial()
      .safeParse(groupInput);

    if (!success) {
      return next({
        status: 400,
        message: error.errors.map((err) => err.message).join(', '),
      });
    }

    try {
      const currentUser: User | null = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
      });

      const group: Group | null = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
      });

      if (!group || !currentUser) {
        return next({
          status: 404,
          message: 'User or Group not found',
        });
      }

      if (group.ownerId !== currentUser.id) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      const updatedGroup: Group = await prisma.group.update({
        where: {
          id: groupId,
        },
        data,
      });

      return res.status(200).json(updatedGroup);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  removeUserFromGroup: async (
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
    const groupId = parseInt(req.params.groupId);
    const userIdToRemove = parseInt(req.params.userId);

    try {
      const userToRemove: UserWithGroups | null = await prisma.user.findUnique({
        where: { id: userIdToRemove },
        include: {
          groups: true,
        },
      });

      if (!userToRemove) {
        return next({
          status: 404,
          message: 'User not found',
        });
      }

      if (userToRemove.groups.length === 1) {
        const newGroupForUser: Group = await prisma.group.create({
          data: {
            name: `${userToRemove.name.substring(0, 10)}'s new family`,
            colorId: randomizer.id(),
            users: {
              connect: {
                id: userIdToRemove,
              },
            },
            ownerId: userIdToRemove,
          },
        });
      }

      const group: GroupWithUsers | null = await prisma.group.findUnique({
        where: { id: groupId },
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

      if (group.users.length === 0) {
        return next({
          status: 404,
          message: 'User is not in the group',
        });
      }

      // Check if the user is trying to remove himself
      if (req.user.id === userIdToRemove) {
        // Check if the user is the owner of the group
        if (group.ownerId === req.user.id) {
          // Check if the group has more than one user
          if (group.users.length > 1) {
            return next({
              status: 403,
              message:
                'You cannot remove yourself from a group you own, you should promote another user to owner first',
            });
          } else {
            return next({
              status: 403,
              message:
                'You are the only user left in the group, you should delete the group instead',
            });
          }
        }
      } else if (group.ownerId !== req.user.id) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      const updatedGroup: Group = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          users: {
            disconnect: {
              id: userIdToRemove,
            },
          },
        },
      });

      return res.status(200).json(updatedGroup);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  addUserToGroup: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const groupId = parseInt(req.params.groupId);
    const userIdToAdd = parseInt(req.params.userId);

    try {
      const userToAdd: User | null = await prisma.user.findUnique({
        where: { id: userIdToAdd },
      });

      if (!userToAdd) {
        return next({
          status: 404,
          message: 'User not found',
        });
      }

      const group = await prisma.group.findUnique({
        where: { id: groupId },
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

      const isUserInGroup = group.users.find((user) => user.id === userIdToAdd);
      if (isUserInGroup) {
        return next({
          status: 409,
          message: 'User is already in the group',
        });
      }

      const isCurrentUserIngroup = group.users.find(
        (user) => user.id === req.user.id,
      );
      if (!isCurrentUserIngroup) {
        return next({
          status: 403,
          message: 'Forbidden',
        });
      }

      let updatedGroup: GroupWithUsers = await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          users: {
            connect: {
              id: userIdToAdd,
            },
          },
        },
        include: {
          users: true,
        },
      });

      // Hide passwords for every user in the group
      updatedGroup.users.forEach((user) => {
        user.password = '';
      });

      return res.status(200).json(updatedGroup);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default groupController;

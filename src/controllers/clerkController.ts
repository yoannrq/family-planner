// [ Package imports ]
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import userSchema from '../utils/validations/userSchema.js';

const clerkController = {
  webhook: async (req: Request, res: Response, next: NextFunction) => {
    // Get user data from Clerk
    const { type, data } = req.body;
    const clerkId = data.id;
    const email = data.email_addresses[0].email_address;
    const name = data.username;
    const profilePictureUrl = data.profile_image_url;

    try {
      const { success, data, error } = userSchema.safeParse({
        name,
        email,
        profilePictureUrl,
        clerkId,
      });

      if (!success) {
        return res.status(400).json({ message: error });
      }

      switch (type) {
        case 'user.created':
          const findUser = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (findUser) {
            return res.status(409).json({ message: 'User already exists' });
          }

          let newUser = await prisma.user.create({
            data: {
              name,
              email,
              profilePictureUrl,
              clerkId,
            },
          });

          newUser.password = '';

          return res.status(201).json(newUser);

        case 'user.updated':
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          let updatedUser = await prisma.user.update({
            where: {
              email,
            },
            data: {
              name,
              email,
              profilePictureUrl,
              clerkId,
            },
          });

          updatedUser.password = '';

          return res.status(200).json(updatedUser);

        case 'session.created':
          console.log('session.created');
          break;

        default:
          return res.status(400).json({ message: 'Bad request' });
      }
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default clerkController;

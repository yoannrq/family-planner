// [ Package imports ]
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

// [ Local imports ]
import prisma from '../models/client.js';
import userSchema from '../utils/validations/userSchema.js';

const meController = {
  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userEmail = req.user.email;

    const { success, data, error } = userSchema.partial().safeParse(req.body);

    try {
      if (!success) {
        return next({
          status: 400,
          message: error.errors.map((err) => err.message).join(', '),
        });
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: {
          email: userEmail,
        },
        data,
      });

      updatedUser.password = '';

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default meController;

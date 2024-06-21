// [ Package imports ]
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import userSchema from '../utils/validations/userSchema.js';

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { success, data, error } = userSchema.safeParse(req.body);

      if (!success) {
        return res.status(400).json({ message: error });
      }

      const { name, email, password } = data;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      newUser.password = '';

      res.status(201).json(newUser);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default authController;

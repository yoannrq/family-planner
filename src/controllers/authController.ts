// [ Package imports ]
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import prisma from '../models/client.js';
import userSchema from '../utils/validations/userSchema.js';
import jwtService from '../utils/jwtService.js';

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { success, data, error } = userSchema.safeParse(req.body);

      if (!success) {
        return next({
          status: 400,
          message: error.message,
        });
      }

      const { name, email, password } = data;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        return next({
          status: 409,
          message: 'User already exists',
        });
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

  login: async (req: Request, res: Response, next: NextFunction) => {
    interface UserData {
      email: string;
      password: string;
    }

    try {
      const { success, data, error } = userSchema.partial().safeParse(req.body);

      if (!success) {
        return next({
          status: 400,
          message: error,
        });
      }

      const { email, password } = data as UserData;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return next({
          status: 401,
          message: 'Invalid email or password',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as UserData['password'],
      );

      if (!isPasswordValid) {
        return next({
          status: 401,
          message: 'Invalid email or password',
        });
      }

      user.password = '';

      const accessToken = jwtService.generateAccessToken(user.email);
      const refreshToken = jwtService.generateRefreshToken(user.email);

      const refreshTokenOnUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken,
        },
      });

      if (!refreshTokenOnUser) {
        return next({
          status: 500,
          message: 'Failed to save refresh token',
        });
      }

      res.status(200).json({
        user,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  newAccessToken: async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next({
        status: 400,
        message: 'Refresh token is required',
      });
    }

    try {
      const decodedRefreshToken = jwtService.verifyRefreshToken(refreshToken);

      const verifyUser = await prisma.user.findUnique({
        where: {
          email_refreshToken: {
            email: decodedRefreshToken as string,
            refreshToken: req.body.refreshToken,
          },
        },
      });

      if (!verifyUser) {
        return next({
          status: 401,
          message: 'Invalid refresh token',
        });
      }

      const accessToken = jwtService.generateAccessToken(verifyUser.email);

      res.status(200).json({
        accessToken,
      });
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default authController;

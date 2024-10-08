// [ Package imports ]
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// [ Local imports ]
import prisma from '../models/client.js';
import { User, Prisma, Group } from '@prisma/client';
import { userSchema, UserInput } from '../utils/validations/userSchema.js';
import jwtService from '../utils/jwtService.js';
import randomizer from '../utils/randomizer.js';

// [ Type guard function - return boolean ]
function isJwtPayload(token: string | JwtPayload): token is JwtPayload {
  return typeof token !== 'string' && 'email' in token;
}

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { success, data, error } = userSchema.safeParse(req.body);

      if (!success) {
        return next({
          status: 400,
          message: error.errors.map((err) => err.message).join(', '),
        });
      }

      const { name, email, password } = data as UserInput;

      const user: User | null = await prisma.user.findUnique({
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

      let newUser: User = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      newUser.password = '';

      const firstGroup: Group = await prisma.group.create({
        data: {
          name: `${name.substring(0, 10)}'s family`,
          colorId: randomizer.id(),
          users: {
            connect: {
              email,
            },
          },
          ownerId: newUser.id,
        },
      });

      if (!firstGroup) {
        return next({
          status: 500,
          message: 'Failed to create first group',
        });
      }

      res.status(201).json(newUser);
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { success, data, error } = userSchema.partial().safeParse(req.body);

      if (!success) {
        return next({
          status: 400,
          message: error.errors.map((err) => err.message).join(', '),
        });
      }

      const { email, password } = data as UserInput;

      const user: User | null = await prisma.user.findUnique({
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
        user.password as UserInput['password'],
      );

      if (!isPasswordValid) {
        return next({
          status: 401,
          message: 'Invalid email or password',
        });
      }

      const accessToken = jwtService.generateAccessToken({ email: user.email });
      const refreshToken = jwtService.generateRefreshToken({
        email: user.email,
      });

      const refreshTokenOnUser: Prisma.UserUpdateInput =
        await prisma.user.update({
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

      refreshTokenOnUser.password = '';

      res.status(200).json({
        ...refreshTokenOnUser,
        accessToken,
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
      const decodedToken: JwtPayload | false =
        jwtService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        return next({
          status: 401,
          message: 'Refresh token expired',
        });
      }

      // Check if the token is a valid JWT payload
      if (isJwtPayload(decodedToken) && decodedToken.email) {
        const { email } = decodedToken;

        const verifyUser: User | null = await prisma.user.findUnique({
          where: {
            email_refreshToken: {
              email: email,
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

        const accessToken = jwtService.generateAccessToken({
          email: verifyUser.email,
        });

        res.status(200).json({
          accessToken,
        });
      } else {
        return next({
          status: 401,
          message: decodedToken || 'Invalid refresh token',
        });
      }
    } catch (error: any) {
      return next({
        message: error.message,
      });
    }
  },
};

export default authController;

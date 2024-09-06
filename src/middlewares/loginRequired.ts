// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import jwtService from '../utils/jwtService.js';
import prisma from '../models/client.js';
import { User } from '@prisma/client';

async function loginRequired(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const currentUser: User | null = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = currentUser;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export default loginRequired;

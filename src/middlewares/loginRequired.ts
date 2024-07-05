// [ Package imports ]
import { Request, Response, NextFunction } from 'express';

// [ Local imports ]
import jwtService from '../utils/jwtService.js';
import prisma from '../models/client.js';
import { JwtPayload } from '../../types/express/index.js';

async function loginRequired(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verifyAccessToken(token) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isExist = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!isExist) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export default loginRequired;

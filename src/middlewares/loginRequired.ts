// [ Package imports ]
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

// [ Local imports ]

async function loginRequired(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.CLERK_JWT_PUBLIC_KEY as string,
    );

    // Check if the token is valid
    if (typeof decoded === 'object') {
      req.user = decoded as JwtPayload;
      next();
    } else {
      return res.status(401).json({ error: 'Token invalide' });
    }
  } catch (error: any) {
    return next({
      message: error.message,
    });
  }
}

export default loginRequired;

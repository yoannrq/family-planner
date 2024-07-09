// [ Package imports ]
import jwt from 'jsonwebtoken';
import { JwtPayload as JsonWTPayload } from 'jsonwebtoken';

// [ Local imports ]
import { JwtPayload } from '../../types/express/index.js';

const jwtService = {
  generateAccessToken: (payload: object) => {
    const privateKey = process.env.JWT_ACCESS_PRIVATE_KEY as string;
    const expiresIn = 30; //TODO remettre a 300

    return jwt.sign(
      {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + expiresIn,
      },
      privateKey,
      {
        algorithm: 'ES256',
      },
    );
  },

  generateRefreshToken: (payload: object) => {
    const privateKey = process.env.JWT_REFRESH_PRIVATE_KEY as string;
    const expiresIn = 60; //TODO remettre à 30 * 24 * 60 * 60

    return jwt.sign(
      {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + expiresIn,
      },
      privateKey,
      {
        algorithm: 'ES256',
      },
    );
  },

  verifyAccessToken: (token: string): JwtPayload | false => {
    const publicKey = process.env.JWT_ACCESS_PUBLIC_KEY as string;
    try {
      const accessDecoded = jwt.verify(token, publicKey, {
        algorithms: ['ES256'],
      }) as JsonWTPayload;

      if (typeof accessDecoded.email === 'string') {
        return { email: accessDecoded.email };
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  },

  verifyRefreshToken: (token: string) => {
    const publicKey = process.env.JWT_REFRESH_PUBLIC_KEY as string;

    try {
      const refreshDecoded = jwt.verify(token, publicKey, {
        algorithms: ['ES256'],
      }) as JsonWTPayload;

      if (typeof refreshDecoded.email === 'string') {
        return { email: refreshDecoded.email };
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  },
};

export default jwtService;

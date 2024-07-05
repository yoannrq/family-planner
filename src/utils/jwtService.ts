// [ Package imports ]
import jwt from 'jsonwebtoken';

// [ Local imports ]

const jwtService = {
  generateAccessToken: (payload: object) => {
    const privateKey = process.env.JWT_ACCESS_PRIVATE_KEY as string;
    const expiresIn = 300;

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
    const expiresIn = 30 * 24 * 60 * 60;

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

  verifyAccessToken: (token: string) => {
    const publicKey = process.env.JWT_ACCESS_PUBLIC_KEY as string;
    return jwt.verify(token, publicKey, {
      algorithms: ['ES256'],
    });
  },

  verifyRefreshToken: (token: string) => {
    const publicKey = process.env.JWT_REFRESH_PUBLIC_KEY as string;
    return jwt.verify(token, publicKey, {
      algorithms: ['ES256'],
    });
  },
};

export default jwtService;

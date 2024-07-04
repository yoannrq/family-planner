// [ Package imports ]
import jwt from 'jsonwebtoken';
// [ Local imports ]
const jwtService = {
    generateAccessToken: (payload) => {
        const privateKey = process.env.JWT_ACCESS_PRIVATE_KEY;
        const expiresIn = 300;
        return jwt.sign(Object.assign(Object.assign({}, payload), { exp: Math.floor(Date.now() / 1000) + expiresIn }), privateKey, {
            algorithm: 'ES256',
        });
    },
    generateRefreshToken: (payload) => {
        const privateKey = process.env.JWT_REFRESH_PRIVATE_KEY;
        const expiresIn = 30 * 24 * 60 * 60;
        return jwt.sign(Object.assign(Object.assign({}, payload), { exp: Math.floor(Date.now() / 1000) + expiresIn }), privateKey, {
            algorithm: 'ES256',
        });
    },
    verifyAccessToken: (token) => {
        const publicKey = process.env.JWT_ACCESS_PUBLIC_KEY;
        return jwt.verify(token, publicKey, {
            algorithms: ['ES256'],
        });
    },
    verifyRefreshToken: (token) => {
        const publicKey = process.env.JWT_REFRESH_PUBLIC_KEY;
        return jwt.verify(token, publicKey, {
            algorithms: ['ES256'],
        });
    },
};
export default jwtService;

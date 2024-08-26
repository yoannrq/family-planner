// [ Package imports ]
import jwt from 'jsonwebtoken';
const jwtService = {
    generateAccessToken: (payload) => {
        const privateKey = process.env.JWT_ACCESS_PRIVATE_KEY;
        const expiresIn = process.env.NODE_ENV === 'production' ? 300 : 60;
        return jwt.sign(Object.assign(Object.assign({}, payload), { exp: Math.floor(Date.now() / 1000) + expiresIn }), privateKey, {
            algorithm: 'ES256',
        });
    },
    generateRefreshToken: (payload) => {
        const privateKey = process.env.JWT_REFRESH_PRIVATE_KEY;
        const expiresIn = process.env.NODE_ENV === 'production' ? 30 * 24 * 60 * 60 : 6000;
        return jwt.sign(Object.assign(Object.assign({}, payload), { exp: Math.floor(Date.now() / 1000) + expiresIn }), privateKey, {
            algorithm: 'ES256',
        });
    },
    verifyAccessToken: (token) => {
        const publicKey = process.env.JWT_ACCESS_PUBLIC_KEY;
        try {
            const accessDecoded = jwt.verify(token, publicKey, {
                algorithms: ['ES256'],
            });
            if (typeof accessDecoded.email === 'string') {
                return { email: accessDecoded.email };
            }
            else {
                return false;
            }
        }
        catch (error) {
            return false;
        }
    },
    verifyRefreshToken: (token) => {
        const publicKey = process.env.JWT_REFRESH_PUBLIC_KEY;
        try {
            const refreshDecoded = jwt.verify(token, publicKey, {
                algorithms: ['ES256'],
            });
            if (typeof refreshDecoded.email === 'string') {
                return { email: refreshDecoded.email };
            }
            else {
                return false;
            }
        }
        catch (error) {
            return false;
        }
    },
};
export default jwtService;

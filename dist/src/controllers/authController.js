var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// [ Package imports ]
import bcrypt from 'bcrypt';
// [ Local imports ]
import prisma from '../models/client.js';
import userSchema from '../utils/validations/userSchema.js';
import jwtService from '../utils/jwtService.js';
// [ Type guard function - return boolean ]
function isJwtPayload(token) {
    return typeof token !== 'string' && 'email' in token;
}
const authController = {
    signup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { success, data, error } = userSchema.safeParse(req.body);
            if (!success) {
                return next({
                    status: 400,
                    message: error.errors.map((err) => err.message).join(', '),
                });
            }
            const { name, email, password } = data;
            const user = yield prisma.user.findUnique({
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
            const hashedPassword = yield bcrypt.hash(password, 10);
            let newUser = yield prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            newUser.password = '';
            const randomColorId = Math.floor(Math.random() * 9) + 1;
            const firstGroup = yield prisma.group.create({
                data: {
                    name: `${name}'s family`,
                    colorId: randomColorId,
                    users: {
                        connect: {
                            email,
                        },
                    },
                },
            });
            if (!firstGroup) {
                return next({
                    status: 500,
                    message: 'Failed to create first group',
                });
            }
            res.status(201).json(newUser);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { success, data, error } = userSchema.partial().safeParse(req.body);
            if (!success) {
                return next({
                    status: 400,
                    message: error.errors.map((err) => err.message).join(', '),
                });
            }
            const { email, password } = data;
            const user = yield prisma.user.findUnique({
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
            const isPasswordValid = yield bcrypt.compare(password, user.password);
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
            const refreshTokenOnUser = yield prisma.user.update({
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
            res.status(200).json(Object.assign(Object.assign({}, refreshTokenOnUser), { accessToken }));
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    newAccessToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next({
                status: 400,
                message: 'Refresh token is required',
            });
        }
        try {
            const decodedToken = jwtService.verifyRefreshToken(refreshToken);
            if (!decodedToken) {
                return next({
                    status: 401,
                    message: 'Refresh token expired',
                });
            }
            // Check if the token is a valid JWT payload
            if (isJwtPayload(decodedToken) && decodedToken.email) {
                const { email } = decodedToken;
                const verifyUser = yield prisma.user.findUnique({
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
            }
            else {
                return next({
                    status: 401,
                    message: decodedToken || 'Invalid refresh token',
                });
            }
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default authController;

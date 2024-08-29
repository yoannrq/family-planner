var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
// [ Local imports ]
import prisma from '../models/client.js';
import userSchema from '../utils/validations/userSchema.js';
const meController = {
    updateMe: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        const { success, data, error } = userSchema.partial().safeParse(req.body);
        try {
            if (!success) {
                return next({
                    status: 400,
                    message: error.errors.map((err) => err.message).join(', '),
                });
            }
            if (data.password) {
                data.password = yield bcrypt.hash(data.password, 10);
            }
            const updatedUser = yield prisma.user.update({
                where: {
                    email: userEmail,
                },
                data,
            });
            updatedUser.password = '';
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default meController;

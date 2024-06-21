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
const authController = {
    signup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { success, data, error } = userSchema.safeParse(req.body);
            if (!success) {
                return res.status(400).json({ message: error });
            }
            const { name, email, password } = data;
            const user = yield prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                return res.status(409).json({ message: 'User already exists' });
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
            res.status(201).json(newUser);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default authController;

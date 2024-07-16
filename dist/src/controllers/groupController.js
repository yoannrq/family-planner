var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// [ Local imports ]
import prisma from '../models/client.js';
const groupController = {
    getGroups: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userEmail = req.user.email;
        try {
            const userGroups = yield prisma.user.findUnique({
                where: {
                    email: userEmail,
                },
                select: {
                    groups: true,
                },
            });
            if (!userGroups) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(userGroups.groups);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default groupController;

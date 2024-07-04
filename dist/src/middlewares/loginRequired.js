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
import jwtService from '../utils/jwtService.js';
import prisma from '../models/client.js';
function loginRequired(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwtService.verifyAccessToken(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const isExist = yield prisma.user.findUnique({
                where: {
                    email: decoded.email,
                },
            });
            if (!isExist) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
}
export default loginRequired;

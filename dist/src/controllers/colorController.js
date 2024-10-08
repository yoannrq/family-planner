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
const colorController = {
    getColors: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const colors = yield prisma.color.findMany();
            res.status(200).json(colors);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default colorController;

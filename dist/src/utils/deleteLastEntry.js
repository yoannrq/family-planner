// [ Package imports ]
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
const deleteEntry = (tableName, discriminatingDataType, discriminatingDataValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteQuery = prisma[tableName].delete({
            where: {
                [discriminatingDataType]: discriminatingDataValue,
            },
        });
        const isDeleted = yield deleteQuery;
        return true;
    }
    catch (error) {
        console.error(`Erreur lors de la suppression de l'enregistrement dans la table ${tableName}:`, error);
        return false;
    }
});
export default deleteEntry;

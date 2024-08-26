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
/**
 * @function canAccessToGroup
 * @summary Check if a user can access a group
 * @param {number} id - Group ID
 * @param {string} email - User email
 * @returns {boolean} - True if user can access the group, false otherwise
 */
const canAccessToGroup = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield prisma.group.findFirst({
            where: {
                id,
                users: {
                    some: {
                        email,
                    },
                },
            },
        });
        if (!group) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.error("Erreur lors de la vérification de l'accès au groupe:", error);
        return false;
    }
});
export default canAccessToGroup;

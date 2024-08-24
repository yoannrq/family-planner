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
import prisma from '../../src/models/client.js';
import jwtService from '../../src/utils/jwtService.js';
const createTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash('Password123!', 10);
    const testUserData = {
        name: 'John Doe',
        email: 'john@doe.com',
        password: hashedPassword,
        settingColorId: 1,
        refreshToken: jwtService.generateRefreshToken({ email: 'john@doe.com' }),
    };
    const accessToken = jwtService.generateAccessToken({
        email: testUserData.email,
    });
    const testUser = yield prisma.user.create({
        data: testUserData,
    });
    return Object.assign(Object.assign({}, testUser), { accessToken });
});
export default createTestUser;

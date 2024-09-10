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
import { describe, it, expect, vi, beforeEach, afterEach, afterAll, beforeAll, } from 'vitest';
// [ Local imports ]
import meController from '../src/controllers/meController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';
// [ Variables ]
let testUser;
// [ Tests ]
describe('meController Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield createTestUser('myself');
    }));
    afterEach(() => {
        vi.restoreAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.group.deleteMany({
            where: {
                users: {
                    some: {
                        email: testUser.email,
                    },
                },
            },
        });
        yield prisma.user.deleteMany({
            where: {
                email: testUser.email,
            },
        });
    }));
    it('should have a updateMe method', () => {
        expect(meController.updateMe).toBeDefined();
    });
    it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield meController.updateMe(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: 'Unauthorized',
        }));
    }));
    it('should update user information', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: testUser,
            body: {
                name: 'Myself Updated',
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield meController.updateMe(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Myself Updated',
        }));
    }));
});

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
import groupController from '../src/controllers/groupController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';
const testGroups = [
    {
        name: 'Group 1',
        colorId: 1,
    },
    {
        name: 'Group 2',
        colorId: 2,
    },
];
const randomColorId = Math.floor(Math.random() * 9) + 1;
const randomGroupName = (Math.random() + 1).toString(36).substring(7);
// [ Tests ]
describe('GroupController Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = yield createTestUser('group');
        for (const group of testGroups) {
            yield prisma.group.create({
                data: Object.assign(Object.assign({}, group), { users: {
                        connect: {
                            email: testUser.email,
                        },
                    } }),
            });
        }
    }));
    afterEach(() => {
        vi.restoreAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.group.deleteMany({
            where: {
                users: {
                    some: {
                        email: 'group@test.com',
                    },
                },
            },
        });
        yield prisma.user.deleteMany({
            where: {
                email: 'group@test.com',
            },
        });
    }));
    it('should have a getGroups method', () => {
        expect(groupController.getGroups).toBeDefined();
    });
    it('should return a 401 status code if the user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.getGroups(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: 'Unauthorized',
        }));
    }));
    it('should return a 404 status code if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'groupgroup@test.com',
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.getGroups(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 404,
            message: 'User not found',
        }));
    }));
    it('should return a list of groups', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'group@test.com',
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.getGroups(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(testGroups.map((group) => expect.objectContaining(group))));
    }));
    it('should have a createGroup method', () => {
        expect(groupController.createGroup).toBeDefined();
    });
    it('should return a 401 status code if the user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.createGroup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: 'Unauthorized',
        }));
    }));
    it('should return a 400 status code if the group name is not a string', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'group@test.com',
            },
            body: {
                name: 3,
                colorId: randomColorId,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.createGroup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 400,
            message: "The field 'name' must be a string.",
        }));
    }));
    it('should return a 400 status code if the group name is less than 3 characters', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'group@test.com',
            },
            body: {
                name: 'a',
                colorId: randomColorId,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.createGroup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 400,
            message: "The field 'name' must be at least 3 characters long.",
        }));
    }));
    it('should return a 400 status code if the group name is more than 30 characters', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'group@test.com',
            },
            body: {
                name: 'a'.repeat(31),
                colorId: randomColorId,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.createGroup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 400,
            message: "The field 'name' must be at most 30 characters long.",
        }));
    }));
    it('should return a 400 status code if the colorId is not a number', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'group@test.com',
            },
            body: {
                name: randomGroupName,
                colorId: '1',
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.createGroup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 400,
            message: "The field 'colorId' must be a number.",
        }));
    }));
    it('should create a new group', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'group@test.com',
            },
            body: {
                name: randomGroupName,
                colorId: randomColorId,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield groupController.createGroup(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: randomGroupName,
            colorId: randomColorId,
        }));
    }));
});

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
import contactController from '../src/controllers/contactController.js';
import createTestUser from './helpers/authHelper.js';
import prisma from '../src/models/client.js';
// [ Variables ]
// TODO Reprendre les types proprement
let testUser;
let groupOfTestUser;
const testContacts = [
    {
        firstname: 'Contact 1',
        lastname: 'Test',
        email: 'contact1@test.com',
        phone: '1234567890',
        address: '123 Main St',
    },
    {
        firstname: 'Contact 2',
        lastname: 'Test',
        email: 'contact2@test.com',
        phone: '1234567890',
        type: 'Friend',
        content: 'Best friend',
    },
];
// [ Tests ]
describe('ContactController Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield createTestUser('contact');
        groupOfTestUser = yield prisma.group.findFirst({
            where: {
                users: {
                    some: {
                        email: testUser.email,
                    },
                },
            },
        });
        if (!groupOfTestUser) {
            groupOfTestUser = yield prisma.group.create({
                data: {
                    name: 'Test Group',
                    users: {
                        connect: {
                            email: testUser.email,
                        },
                    },
                },
            });
        }
        for (const contact of testContacts) {
            yield prisma.contact.create({
                data: Object.assign(Object.assign({}, contact), { group: {
                        connect: {
                            id: groupOfTestUser.id,
                        },
                    } }),
            });
        }
    }));
    afterEach(() => {
        vi.restoreAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.contact.deleteMany({
            where: {
                group: {
                    users: {
                        some: {
                            email: testUser.email,
                        },
                    },
                },
            },
        });
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
    it('should have a getContacts method', () => {
        expect(contactController.getContacts).toBeDefined();
    });
    it('should return a 401 status code if the user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield contactController.getContacts(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: 'Unauthorized',
        }));
    }));
    it('should return a 403 status code if the user is not authorized to access the group', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: 'contactcontact@test.com',
            },
            params: {
                groupId: 1,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield contactController.getContacts(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 403,
            message: 'Forbidden',
        }));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    }));
    it('should return a list of contacts', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            user: {
                email: testUser.email,
            },
            params: {
                groupId: groupOfTestUser.id,
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield contactController.getContacts(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining(Object.assign({}, testContacts[0])),
            expect.objectContaining(Object.assign({}, testContacts[1])),
        ]));
    }));
});

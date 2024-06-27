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
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// [ Local imports ]
import authController from '../src/controllers/authController.js';
import deleteEntry from '../src/utils/deleteEntry.js';
// [ Tests ]
describe('AuthController Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should have a signup method', () => {
        expect(authController.signup).toBeDefined();
    });
    it('insert a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            name: 'John Doe',
            email: 'john@doe.com',
            password: 'Password123!',
        };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.signup(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '',
        }));
    }));
    it('should have a login method', () => {
        expect(authController.login).toBeDefined();
    });
    it('login an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            email: 'john@doe.com',
            password: 'Password123!',
        };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.login(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'John Doe',
            email: 'john@doe.com',
            password: '',
        }));
        // Clean up the database
        const isDeleted = yield deleteEntry('User', 'email', 'john@doe.com');
        expect(isDeleted).toBe(true);
    }));
});

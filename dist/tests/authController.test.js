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
import { describe, it, expect, vi, beforeEach, afterEach, afterAll, } from 'vitest';
// [ Local imports ]
import authController from '../src/controllers/authController.js';
import prisma from '../src/models/client.js';
// [ Tests ]
describe('AuthController Tests', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        vi.clearAllMocks();
    }));
    afterEach(() => {
        vi.restoreAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.group.deleteMany({
            where: {
                users: {
                    some: {
                        email: 'auth@test.com',
                    },
                },
            },
        });
        yield prisma.user.deleteMany({
            where: {
                email: 'auth@test.com',
            },
        });
    }));
    it('should have a signup method', () => {
        expect(authController.signup).toBeDefined();
    });
    it('should send a 400 status code if the password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            name: 'Auth Test User',
            email: 'auth@test.com',
            password: 'Password123',
            settingColorId: 1,
        };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.signup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 400,
            message: expect.stringContaining("The field 'password' must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character."),
        }));
    }));
    it('should insert a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            name: 'Auth Test User',
            email: 'auth@test.com',
            password: 'Password123!',
            settingColorId: 1,
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
            name: 'Auth Test User',
            email: 'auth@test.com',
        }));
        const user = yield prisma.user.findUnique({
            where: { email: 'auth@test.com' },
        });
        expect(user).toBeDefined();
        expect(user === null || user === void 0 ? void 0 : user.password).not.toBe('Password123!');
    }));
    it('should send a 409 status code if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            name: 'Auth Test User',
            email: 'auth@test.com',
            password: 'Password123!',
            settingColorId: 1,
        };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.signup(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 409,
            message: expect.stringContaining('User already exists'),
        }));
    }));
    it('should have created a group for the new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userGroup = yield prisma.group.findFirst({
            where: {
                users: {
                    some: {
                        email: 'auth@test.com',
                    },
                },
            },
        });
        expect(userGroup).toMatchObject({
            name: `Auth Test User's family`,
            colorId: expect.any(Number),
        });
    }));
    it('should have a login method', () => {
        expect(authController.login).toBeDefined();
    });
    it('should send a 401 status code if the email does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            email: 'authauth@test.com',
            password: 'Password123!',
        };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.login(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: expect.stringContaining('Invalid email or password'),
        }));
    }));
    it('should send a 401 status code if the password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            email: 'auth@test.com',
            password: 'Password1234!',
        };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.login(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: expect.stringContaining('Invalid email or password'),
        }));
    }));
    it('should login an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = {
            email: 'auth@test.com',
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
            name: 'Auth Test User',
            email: 'auth@test.com',
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        }));
    }));
    it('should have a newAccessToken method', () => {
        expect(authController.newAccessToken).toBeDefined();
    });
    it('should send a 400 status code if the refresh token is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: {} };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.newAccessToken(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 400,
            message: expect.stringContaining('Refresh token is required'),
        }));
    }));
    it('should send a 401 status code if the refresh token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const entryData = { refreshToken: 'invalid' };
        const req = { body: entryData };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.newAccessToken(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            status: 401,
            message: expect.stringContaining('Refresh token expired'),
        }));
    }));
    it('should send an access token if the refresh token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: { email: 'auth@test.com' },
        });
        const validRefreshToken = user === null || user === void 0 ? void 0 : user.refreshToken;
        const req = { body: { refreshToken: validRefreshToken } };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield authController.newAccessToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            accessToken: expect.any(String),
        }));
    }));
});

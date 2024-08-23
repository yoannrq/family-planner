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
import { describe, it, expect, vi } from 'vitest';
// [ Local imports ]
import groupController from '../src/controllers/groupController.js';
// [ Tests ]
describe('GroupController Tests', () => {
    it('should have a getGroups method', () => {
        expect(groupController.getGroups).toBeDefined();
    });
    it('should return a list of groups', () => __awaiter(void 0, void 0, void 0, function* () {
        const userGroups = [
            {
                name: 'Family',
                colorId: 1,
            },
            {
                name: 'Friends',
                colorId: 2,
            },
        ];
        const req = {
            user: {
                email: 'alice@smith.com',
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
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(userGroups.map((group) => expect.objectContaining(group))));
    }));
    it('should have a createGroup method', () => {
        expect(groupController.createGroup).toBeDefined();
    });
    it('should create a new group', () => __awaiter(void 0, void 0, void 0, function* () {
        const randomColorId = Math.floor(Math.random() * 9) + 1;
        const randomColorIdToString = randomColorId.toString();
        const randomGroupName = (Math.random() + 1).toString(36).substring(7);
        const req = {
            user: {
                email: 'alice@smith.com',
            },
            body: {
                name: randomGroupName,
                colorId: randomColorIdToString,
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

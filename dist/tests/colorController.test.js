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
import colorController from '../src/controllers/colorController.js';
// [ Tests ]
describe('ColorController Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should have a getColors method', () => {
        expect(colorController.getColors).toBeDefined();
    });
    it('should return a list of colors', () => __awaiter(void 0, void 0, void 0, function* () {
        const defaultColors = [
            {
                name: 'Perroquet',
                hexCode: '#0388fc',
            },
            {
                name: 'Tangerine',
                hexCode: '#F28500',
            },
            {
                name: 'Pistache',
                hexCode: '#BEF574',
            },
            {
                name: 'Lavande',
                hexCode: '#9683EC',
            },
            {
                name: 'Cerise',
                hexCode: '#bb0b0b',
            },
            {
                name: 'Sable',
                hexCode: '#E6D690',
            },
            {
                name: 'Menthe',
                hexCode: '#16b84e',
            },
            {
                name: 'Métal',
                hexCode: '#b6bdb9',
            },
            {
                name: 'Nuit',
                hexCode: '#0F056B',
            },
            {
                name: 'Pêche',
                hexCode: '#FFCBA4',
            },
        ];
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        yield colorController.getColors(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(defaultColors));
    }));
});

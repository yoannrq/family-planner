// [ Package imports ]
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';

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

  it('should return a list of colors', async () => {
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
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    await colorController.getColors(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining(
        defaultColors.map((color) => expect.objectContaining(color)),
      ),
    );
  });
});

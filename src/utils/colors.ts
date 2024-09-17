import { Color } from '@prisma/client';

const COLORS = Object.freeze([
  {
    id: 1,
    name: 'Perroquet',
    hexCode: '#0388fc',
    createdAt: '2024-09-03T11:57:55.431Z',
    updatedAt: '2024-09-03T11:57:55.431Z',
  },
  {
    id: 2,
    name: 'Tangerine',
    hexCode: '#F28500',
    createdAt: '2024-09-03T11:57:55.482Z',
    updatedAt: '2024-09-03T11:57:55.482Z',
  },
  {
    id: 3,
    name: 'Pistache',
    hexCode: '#BEF574',
    createdAt: '2024-09-03T11:57:55.506Z',
    updatedAt: '2024-09-03T11:57:55.506Z',
  },
  {
    id: 4,
    name: 'Lavande',
    hexCode: '#9683EC',
    createdAt: '2024-09-03T11:57:55.527Z',
    updatedAt: '2024-09-03T11:57:55.527Z',
  },
  {
    id: 5,
    name: 'Cerise',
    hexCode: '#bb0b0b',
    createdAt: '2024-09-03T11:57:55.549Z',
    updatedAt: '2024-09-03T11:57:55.549Z',
  },
  {
    id: 6,
    name: 'Sable',
    hexCode: '#E6D690',
    createdAt: '2024-09-03T11:57:55.571Z',
    updatedAt: '2024-09-03T11:57:55.571Z',
  },
  {
    id: 7,
    name: 'Menthe',
    hexCode: '#16b84e',
    createdAt: '2024-09-03T11:57:55.593Z',
    updatedAt: '2024-09-03T11:57:55.593Z',
  },
  {
    id: 8,
    name: 'Métal',
    hexCode: '#b6bdb9',
    createdAt: '2024-09-03T11:57:55.615Z',
    updatedAt: '2024-09-03T11:57:55.615Z',
  },
  {
    id: 9,
    name: 'Nuit',
    hexCode: '#0F056B',
    createdAt: '2024-09-03T11:57:55.638Z',
    updatedAt: '2024-09-03T11:57:55.638Z',
  },
  {
    id: 10,
    name: 'Pêche',
    hexCode: '#FFCBA4',
    createdAt: '2024-09-03T11:57:55.660Z',
    updatedAt: '2024-09-03T11:57:55.660Z',
  },
]);

export function isValidColorId(colorId: number): boolean {
  const isValid = Object.values(COLORS).some((color) => color.id === colorId);
  return isValid;
}

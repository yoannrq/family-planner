import { mockDeep, mockReset } from 'vitest-mock-extended';
import { beforeEach } from 'vitest';
export const prisma = mockDeep();
beforeEach(() => {
    mockReset(prisma);
});
export default prisma;

import { assert } from 'console';
import seed from './seed.json' assert { type: 'json' };
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password) {
  const hachedPassword = await bcrypt.hash(password, 10);
  return hachedPassword;
}

async function main() {
  for (const user of seed.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: await hashPassword(user.password),
      },
      create: {
        email: user.email,
        password: await hashPassword(user.password),
        name: user.name,
      },
    });
  }
}

main().catch((e) => {
  throw e;
});
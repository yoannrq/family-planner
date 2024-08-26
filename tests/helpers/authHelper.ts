// [ Package imports ]
import bcrypt from 'bcrypt';

// [ Local imports ]
import prisma from '../../src/models/client.js';
import jwtService from '../../src/utils/jwtService.js';

const createTestUser = async (scope: string) => {
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const testUserData = {
    name: `${scope} Test User`,
    email: `${scope}@test.com`,
    password: hashedPassword,
    settingColorId: 1,
    refreshToken: jwtService.generateRefreshToken({
      email: `${scope}@test.com`,
    }),
  };
  const accessToken = jwtService.generateAccessToken({
    email: testUserData.email,
  });

  const testUser = await prisma.user.create({
    data: testUserData,
  });

  return { ...testUser, accessToken };
};

export default createTestUser;

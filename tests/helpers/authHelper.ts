// [ Package imports ]
import bcrypt from 'bcrypt';

// [ Local imports ]
import prisma from '../../src/models/client.js';
import jwtService from '../../src/utils/jwtService.js';

const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const testUserData = {
    name: 'John Doe',
    email: 'john@doe.com',
    password: hashedPassword,
    settingColorId: 1,
    refreshToken: jwtService.generateRefreshToken({ email: 'john@doe.com' }),
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

// [ Package imports ]

// [ Local imports ]
import prisma from '../models/client.js';

/**
 * @function canAccessToGroup
 * @summary Check if a user can access a group
 * @param {number} id - Group ID
 * @param {string} email - User email
 * @returns {boolean} - True if user can access the group, false otherwise
 */
const canAccessToGroup = async (
  id: number,
  email: string,
): Promise<boolean> => {
  try {
    const group = await prisma.group.findFirst({
      where: {
        id,
        users: {
          some: {
            email,
          },
        },
      },
    });

    if (!group) {
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(
      "Erreur lors de la vérification de l'accès au groupe:",
      error,
    );
    return false;
  }
};

export default canAccessToGroup;

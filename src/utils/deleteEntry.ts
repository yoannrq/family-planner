// [ Package imports ]

// [ Local imports ]
import prisma from '../models/client.js';

const deleteEntry = async (
  tableName: string,
  discriminatingDataType: string,
  discriminatingDataValue: any,
) => {
  try {
    // Query construction
    const deleteQuery = (prisma as any)[tableName].delete({
      where: {
        [discriminatingDataType]: discriminatingDataValue,
      },
    });

    const isDeleted = await deleteQuery;
    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'enregistrement dans la table ${tableName}:`,
      error,
    );
    return false;
  }
};

export default deleteEntry;

/*
  Warnings:

  - Added the required column `ownerId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- Add the column `ownerId` to the `Group` table and allow NULL values
ALTER TABLE "Group" ADD COLUMN "ownerId" INTEGER;

-- Add a foreign key constraint to the `ownerId` column
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update the `ownerId` column to point to the first user that is part of the group
UPDATE "Group" SET "ownerId" = (
  SELECT "_UserHasGroup"."A" FROM "_UserHasGroup" WHERE "_UserHasGroup"."B" = "Group".id ORDER BY "_UserHasGroup"."A" LIMIT 1
);

-- Make the `ownerId` column non-nullable
ALTER TABLE "Group" ALTER COLUMN "ownerId" SET NOT NULL;

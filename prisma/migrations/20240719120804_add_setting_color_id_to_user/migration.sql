-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settingColorId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_settingColorId_fkey" FOREIGN KEY ("settingColorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "colorId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `date` on the `CalendarEntry` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `CalendarEntry` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `CalendarEntry` table. All the data in the column will be lost.
  - You are about to drop the column `entireDay` on the `CalendarEntry` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `CalendarEntry` table. All the data in the column will be lost.
  - Added the required column `startAt` to the `CalendarEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CalendarEntry"
ADD COLUMN "allDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "endAt" TIMESTAMP(3),
ADD COLUMN "startAt" TIMESTAMP(3);

-- Mise à jour des données
UPDATE "CalendarEntry"
SET "startAt" = "date";

-- Suppression des anciennes colonnes
ALTER TABLE "CalendarEntry"
DROP COLUMN "date",
DROP COLUMN "endDate",
DROP COLUMN "endTime",
DROP COLUMN "entireDay",
DROP COLUMN "startTime";

-- Ajout de la contrainte NOT NULL après la migration des données
ALTER TABLE "CalendarEntry"
ALTER COLUMN "startAt" SET NOT NULL;
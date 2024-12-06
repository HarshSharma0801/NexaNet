/*
  Warnings:

  - Added the required column `avatar` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "avatar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "avatar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserGroup" ADD COLUMN     "avatar" TEXT;

/*
  Warnings:

  - You are about to drop the column `isPusblished` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isPusblished",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

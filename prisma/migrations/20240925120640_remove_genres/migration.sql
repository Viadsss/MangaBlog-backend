/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostGenre" DROP CONSTRAINT "PostGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "PostGenre" DROP CONSTRAINT "PostGenre_postId_fkey";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "PostGenre";

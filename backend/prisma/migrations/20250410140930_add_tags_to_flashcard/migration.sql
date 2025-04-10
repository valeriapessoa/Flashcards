-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

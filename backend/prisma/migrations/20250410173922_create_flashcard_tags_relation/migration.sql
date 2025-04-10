/*
  Warnings:

  - You are about to drop the column `tags` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FlashcardTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FlashcardTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_text_key" ON "Tag"("text");

-- CreateIndex
CREATE INDEX "_FlashcardTags_B_index" ON "_FlashcardTags"("B");

-- AddForeignKey
ALTER TABLE "_FlashcardTags" ADD CONSTRAINT "_FlashcardTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlashcardTags" ADD CONSTRAINT "_FlashcardTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

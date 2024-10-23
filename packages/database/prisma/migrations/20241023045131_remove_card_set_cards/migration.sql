/*
  Warnings:

  - You are about to drop the `card_set_cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "card_sets" ADD COLUMN     "cards" JSONB[];

-- DropTable
DROP TABLE "card_set_cards";

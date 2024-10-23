/*
  Warnings:

  - You are about to drop the column `commonOdd` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `commons` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `other` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `rareOdd` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `rares` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `superRareOdd` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `superRares` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `ultraRareOdd` on the `card_sets` table. All the data in the column will be lost.
  - You are about to drop the column `ultraRares` on the `card_sets` table. All the data in the column will be lost.
  - Added the required column `distribution` to the `card_sets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `odds` to the `card_sets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "card_sets" DROP COLUMN "commonOdd",
DROP COLUMN "commons",
DROP COLUMN "other",
DROP COLUMN "rareOdd",
DROP COLUMN "rares",
DROP COLUMN "superRareOdd",
DROP COLUMN "superRares",
DROP COLUMN "ultraRareOdd",
DROP COLUMN "ultraRares",
ADD COLUMN     "distribution" JSONB NOT NULL,
ADD COLUMN     "odds" JSONB NOT NULL;

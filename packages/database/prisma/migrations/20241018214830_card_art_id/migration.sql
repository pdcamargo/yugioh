/*
  Warnings:

  - Added the required column `artId` to the `user_cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_cards" ADD COLUMN     "artId" TEXT NOT NULL;

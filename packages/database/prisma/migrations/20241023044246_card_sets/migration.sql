-- CreateTable
CREATE TABLE "card_sets" (
    "id" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo" TIMESTAMP(3),
    "packType" TEXT NOT NULL,
    "commons" INTEGER NOT NULL,
    "rares" INTEGER NOT NULL,
    "superRares" INTEGER NOT NULL,
    "ultraRares" INTEGER NOT NULL,
    "other" INTEGER NOT NULL,
    "commonOdd" DOUBLE PRECISION NOT NULL DEFAULT 0.45,
    "rareOdd" DOUBLE PRECISION NOT NULL DEFAULT 0.45,
    "superRareOdd" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "ultraRareOdd" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_set_cards" (
    "id" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "cardSetId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "artId" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_set_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_set_cards_cardSetId_idx" ON "card_set_cards"("cardSetId");

-- CreateIndex
CREATE INDEX "card_set_cards_cardId_idx" ON "card_set_cards"("cardId");

-- CreateIndex
CREATE INDEX "card_set_cards_artId_idx" ON "card_set_cards"("artId");

-- CreateIndex
CREATE INDEX "card_set_cards_rarity_idx" ON "card_set_cards"("rarity");

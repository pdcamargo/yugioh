-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "matchId" TEXT NOT NULL,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "player1DeckId" TEXT NOT NULL,
    "player2DeckId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matches_player1Id_idx" ON "matches"("player1Id");

-- CreateIndex
CREATE INDEX "matches_player2Id_idx" ON "matches"("player2Id");

-- CreateIndex
CREATE INDEX "matches_matchId_idx" ON "matches"("matchId");

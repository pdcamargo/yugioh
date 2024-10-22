"use server";

import { z } from "zod";

import cardsData from "~/cards.json";

import { prisma } from "@repo/database";

import { createSafeQueryWithAuth } from "../safe-query";

export type PlayerCardType = Awaited<ReturnType<typeof getPlayerCards>>[number];

export type PlayerDeckType = Awaited<ReturnType<typeof getDecks>>[number];

export const getDecks = createSafeQueryWithAuth().query(async ({ user }) => {
  const decks = await prisma.deck.findMany({
    where: {
      userId: user.id,
    },
    include: {
      cards: {
        select: {
          id: true,
          card: true,
          cardId: true,
          createdAt: true,
          deckId: true,
        },
      },
    },
  });

  return decks.map((deck) => {
    return {
      ...deck,
      cards: deck.cards.map((card) => {
        const { id, ...cardData } = (cardsData as Array<CardJsonInfo>).find(
          (c) => c.id.toString() === card.card.cardId.toString(),
        )!;

        return {
          ...card,
          ...cardData,
        };
      }),
    };
  });
});

export const getDeck = createSafeQueryWithAuth()
  .schema(
    z.object({
      deckId: z.string(),
    }),
  )
  .query(async ({ user, parsedInput: { deckId } }) => {
    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId: user.id,
      },
      include: {
        cards: {
          select: {
            id: true,
            card: true,
            cardId: true,
            createdAt: true,
            deckId: true,
          },
        },
      },
    });

    if (!deck) {
      throw new Error("Deck not found");
    }

    const cards: PlayerCardType[] = deck.cards.map((card) => {
      const { id, ...cardData } = (cardsData as Array<CardJsonInfo>).find(
        (c) => c.id.toString() === card.card.cardId.toString(),
      )!;

      return {
        ...card.card,
        ...cardData,
        artId: card.card.artId,
      };
    });

    return {
      ...deck,
      cards,
    };
  });

export const getPlayerCards = createSafeQueryWithAuth().query(
  async ({ user }) => {
    const cards = await prisma.userCard.findMany({
      where: {
        userId: user.id,
      },
    });

    return cards.map((card) => {
      const { id, ...cardData } = (cardsData as Array<CardJsonInfo>).find(
        (c) => c.id.toString() === card.cardId.toString(),
      )!;

      return {
        ...card,
        ...cardData,
      };
    });
  },
);

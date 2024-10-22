"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@repo/database";

import { authActionClient } from "../safe-action";

export const createDeck = authActionClient
  .schema(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      cards: z
        .array(
          z.object({
            userCardId: z.string(),
          }),
        )
        .optional(),
    }),
  )
  .metadata({ actionName: "createDeck" })
  .action(async ({ ctx: { user }, parsedInput }) => {
    const deck = await prisma.deck.create({
      data: {
        userId: user.id,
        name: parsedInput.name,
        description: parsedInput.description,
      },
    });

    if (parsedInput.cards) {
      await prisma.deckCard.createMany({
        data: parsedInput.cards.map((card) => ({
          deckId: deck.id,
          cardId: card.userCardId,
        })),
      });
    }

    revalidatePath("/deck");

    return deck;
  });

export const updateDeck = authActionClient
  .schema(
    z.object({
      deckId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      cards: z.array(
        z.object({
          userCardId: z.string(),
        }),
      ),
    }),
  )
  .metadata({ actionName: "updateDeck" })
  .action(async ({ ctx: { user }, parsedInput }) => {
    await prisma.deckCard.deleteMany({
      where: {
        deckId: parsedInput.deckId,
      },
    });

    if (parsedInput.cards) {
      await prisma.deckCard.createMany({
        data: parsedInput.cards.map((card) => ({
          deckId: parsedInput.deckId,
          cardId: card.userCardId,
        })),
      });
    }

    const deck = await prisma.deck.update({
      where: {
        id: parsedInput.deckId,
        userId: user.id,
      },
      data: {
        name: parsedInput.name,
        description: parsedInput.description,
      },
    });

    revalidatePath("/deck");

    return deck;
  });

export const deleteDeck = authActionClient
  .schema(
    z.object({
      deckId: z.string(),
    }),
  )
  .metadata({ actionName: "deleteDeck" })
  .action(async ({ ctx: { user }, parsedInput }) => {
    await prisma.deckCard.deleteMany({
      where: {
        deckId: parsedInput.deckId,
      },
    });

    await prisma.deck.delete({
      where: {
        id: parsedInput.deckId,
        userId: user.id,
      },
    });

    revalidatePath("/deck");

    return true;
  });

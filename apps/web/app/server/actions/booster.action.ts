"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@repo/database";

import { authActionClient } from "../safe-action";

export const addBoosterToUser = authActionClient
  .schema(
    z.object({
      setId: z.string(),
      price: z.number(),
      cards: z.array(
        z.object({
          cardId: z.string(),
          artId: z.string(),
          rarity: z.string(),
        }),
      ),
    }),
  )
  .metadata({ actionName: "addBoosterToUser" })
  .action(async ({ ctx: { user }, parsedInput }) => {
    if (user.gems < parsedInput.price) {
      throw new Error("Insufficient gems");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        gems: {
          decrement: parsedInput.price,
        },
      },
    });

    await prisma.userCard.createMany({
      data: parsedInput.cards.map((card) => ({
        userId: user.id,
        cardId: card.cardId,
        artId: card.artId,
        rarity: card.rarity,
      })),
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/boosters/${parsedInput.setId}`);
  });

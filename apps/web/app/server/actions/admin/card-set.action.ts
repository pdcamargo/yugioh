"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@repo/database";

import { authActionClient } from "../../safe-action";

export const createSet = authActionClient
  .schema(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      available: z.object({
        from: z.date(),
        to: z.date(),
      }),
      packType: z.string(),
      coverImage: z.string(),
      cards: z.array(
        z.object({
          cardId: z.number(),
          rarity: z.string(),
          arts: z.array(
            z.object({
              id: z.number(),
              weight: z.number(),
            }),
          ),
        }),
      ),
      distribution: z.object({
        Common: z.number(),
        Rare: z.number(),
        "Super Rare": z.number(),
        "Ultra Rare": z.number(),
        Other: z.number(),
      }),
      odds: z.object({
        Common: z.number(),
        Rare: z.number(),
        "Super Rare": z.number(),
        "Ultra Rare": z.number(),
      }),
    }),
  )
  .metadata({ actionName: "createSet" })
  .action(async ({ ctx: { user }, parsedInput }) => {
    const set = await prisma.cardSet.create({
      data: {
        name: parsedInput.name,
        description: parsedInput.description,
        distribution: parsedInput.distribution,
        odds: parsedInput.odds,
        availableFrom: parsedInput.available.from,
        availableTo: parsedInput.available.to,
        packType: parsedInput.packType,
        coverImage: parsedInput.coverImage,
        cards: parsedInput.cards.map((card) => ({
          cardId: card.cardId,
          rarity: card.rarity,
          arts: card.arts.map((art) => ({
            id: art.id,
            weight: art.weight,
          })),
        })),
      },
    });

    revalidatePath(`/admin/sets`);

    return set;
  });

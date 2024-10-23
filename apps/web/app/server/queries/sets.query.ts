import { z } from "zod";
import { createSafeQueryWithAuth } from "../safe-query";

import cardsData from "~/cards.json";
import setsData from "~/sets.json";

export const getSets = createSafeQueryWithAuth().query(async () => {
  return setsData
    .filter((set) => {
      const { from, to } = set.available;

      const now = new Date();

      return now >= new Date(from) && now <= new Date(to);
    })
    .map((set) => {
      const now = new Date();

      const remainingDays = Math.ceil(
        (new Date(set.available.to).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        ...set,
        remainingDays,
        cards: set.cards.map((card) => {
          const { id, ...cardData } = (cardsData as Array<CardJsonInfo>).find(
            (c) => c.id.toString() === card.cardId.toString(),
          )!;

          const arts = card.arts.map((art) => {
            return {
              ...art,
              imageUrl: cardData.cardImages.find((ci) => ci.id === art.id)!
                .imageUrl,
            };
          });

          return {
            ...card,
            ...cardData,
            arts,
          };
        }),
      };
    });
});

export type CardSetType = Awaited<ReturnType<typeof getSets>>[number];

export const getSet = createSafeQueryWithAuth()
  .schema(
    z.object({
      setId: z.string(),
    }),
  )
  .query(async ({ parsedInput: { setId } }) => {
    const set = setsData.find((set) => set.id === setId);

    if (!set) {
      return null;
    }

    const now = new Date();

    const remainingDays = Math.ceil(
      (new Date(set.available.to).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return {
      ...set,
      remainingDays,
      cards: set.cards.map((card) => {
        const { id, ...cardData } = (cardsData as Array<CardJsonInfo>).find(
          (c) => c.id.toString() === card.cardId.toString(),
        )!;

        const arts = card.arts.map((art) => {
          return {
            ...art,
            imageUrl: cardData.cardImages.find((ci) => ci.id === art.id)!
              .imageUrl,
          };
        });

        return {
          ...card,
          ...cardData,
          arts,
        };
      }),
    };
  });

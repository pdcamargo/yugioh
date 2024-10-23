"use client";

import { Button } from "~/components/ui/button";
import type { CardSetType } from "~/server/queries/sets.query";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { addBoosterToUser } from "~/server/actions/booster.action";

interface CardArt {
  id: number;
  weight: number;
  imageUrl: string;
}

interface Card {
  cardId: number;
  rarity: string;
  arts: CardArt[];
  selectedArt: CardArt;
}

function openBooster(set: CardSetType) {
  const selectedCards: Card[] = [];
  const distribution = set.distribution;

  // Helper function to get cards by rarity
  function getCardsByRarity(rarity: string) {
    return set.cards.filter((card) => card.rarity === rarity) as Array<
      CardSetType["cards"][number] & {
        selectedArt: CardArt;
      }
    >;
  }

  // Helper function to randomly pick one card from a list based on their weights
  function pickRandomCard(
    cards: Array<
      CardSetType["cards"][number] & {
        selectedArt: CardArt;
      }
    >,
  ): Card | null {
    if (cards.length === 0) return null;

    return cards[Math.floor(Math.random() * cards.length)];
  }

  // Helper function to pick card art based on weights
  function pickCardArt(card: Card): CardArt {
    const totalWeight = card.arts.reduce((sum, art) => sum + art.weight, 0);
    const randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const art of card.arts) {
      cumulativeWeight += art.weight;
      if (randomValue <= cumulativeWeight) {
        const imageUrl = card.arts.find((a) => a.id === art.id)?.imageUrl!;

        return {
          ...art,
          imageUrl,
        };
      }
    }

    return card.arts[card.arts.length - 1]; // Fallback to the last art
  }

  // Helper function to pick a card for "Other" rarity based on specific odds
  function pickOtherCard(): Card | null {
    const odds = [
      { rarity: "Common", probability: 0.4 },
      { rarity: "Rare", probability: 0.3 },
      { rarity: "Super Rare", probability: 0.2 },
      { rarity: "Ultra Rare", probability: 0.1 },
    ];

    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (const { rarity, probability } of odds) {
      cumulativeProbability += probability;
      if (randomValue <= cumulativeProbability) {
        const availableCards = getCardsByRarity(rarity);
        return pickRandomCard(availableCards);
      }
    }

    return null;
  }

  // Pick cards based on the distribution
  for (const [rarity, count] of Object.entries(distribution)) {
    if (rarity === "Other" && count > 0) {
      for (let i = 0; i < count; i++) {
        let pickedCard = pickOtherCard();

        while (!pickedCard) {
          pickedCard = pickOtherCard();
        }

        selectedCards.push({
          ...pickedCard,
          selectedArt: pickCardArt(pickedCard),
        });
      }
    } else if (count > 0) {
      const availableCards = getCardsByRarity(rarity);
      for (let i = 0; i < count; i++) {
        let pickedCard = pickRandomCard(availableCards);

        while (!pickedCard) {
          pickedCard = pickRandomCard(availableCards);
        }

        // Add the card with the selected art to the booster
        selectedCards.push({
          ...pickedCard,
          selectedArt: pickCardArt(pickedCard),
        });
      }
    }
  }

  return selectedCards;
}

const ConfirmPurchase = NiceModal.create(
  ({
    set,
    price,
    onConfirm,
  }: {
    set: CardSetType;
    price: number;
    onConfirm: () => void;
  }) => {
    const modal = useModal(ConfirmPurchase);

    useEffect(() => {
      return () => {
        modal.remove();
      };
    }, []);

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(visible) => {
          if (!visible) {
            modal.hide();
          } else {
            modal.show();
          }
        }}
      >
        <DialogContent className="text-white dark:bg-cyan-950">
          <DialogHeader>
            <DialogTitle>Purchase Confirmation</DialogTitle>
          </DialogHeader>
          Buy {set.name} Pack for {price} gems?
          <DialogFooter className="flex flex-row space-x-0 items-center sm:justify-center gap-3 w-full">
            <Button
              variant="fancy"
              className="text-lime-500 border-b-lime-500 border-r-black border-t-black border-l-black"
              size="lg"
              style={{
                // @ts-expect-error -- types does not support css variables
                "--color": "black",
              }}
              onClick={() => {
                modal.hide();
              }}
            >
              Cancel
            </Button>

            <Button
              variant="fancy"
              className="text-lime-500 border-b-lime-500 border-r-black border-t-black border-l-black"
              size="lg"
              // @ts-expect-error -- types does not support css variables
              style={{ "--color": "black" }}
              onClick={() => {
                onConfirm();
                modal.hide();
              }}
            >
              Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

const OpenBooster = NiceModal.create(({ set }: { set: CardSetType }) => {
  const [state, setState] = useState<"idle" | "opening" | "done">("idle");

  const [cards, setCards] = useState<Card[]>([]);

  const modal = useModal(OpenBooster);

  const handleOpenBooster = async () => {
    const newCards = openBooster(set);

    setCards(newCards);

    console.log({ newCards });

    await addBoosterToUser({
      price: 100, // TODO: figureout if we want custom prices
      setId: set.id,
      cards: newCards.map((card) => ({
        cardId: card.cardId.toString(),
        artId: card.selectedArt.id.toString(),
        rarity: card.rarity,
      })),
    });

    setState("opening");
  };

  useEffect(() => {
    return () => {
      setState("idle");
    };
  }, []);

  if (!modal.visible) {
    return null;
  }

  return (
    <div className="z-50 fixed inset-0 pointer-events-auto bg-cyan-950 flex items-center justify-center flex-col gap-7 animate-in fade-in animate-out fade-out">
      {state === "idle" && (
        <div className="w-[222px] h-[325px] bg-gray-300 border-gray-500"></div>
      )}

      {state === "opening" && (
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-3 animate-in slide-in-from-bottom-10 delay-75 animate-out slide-out-to-top-10">
            {cards.map((card, idx) => (
              <img
                key={card.cardId + " " + idx}
                src={card.selectedArt.imageUrl}
                alt="Card Preview"
                className="w-28 h-auto object-cover"
              />
            ))}
          </div>

          <Button
            variant="fancy"
            size="xl"
            className="text-black font-bold flex items-center justify-between w-full border-black border-b-lime-500 bg-black max-w-[222px]"
            onClick={() => {
              setState("idle");
              modal.hide();
            }}
          >
            Done
          </Button>
        </div>
      )}

      {state === "idle" && (
        <Button
          variant="fancy"
          size="xl"
          className="text-black font-bold flex items-center justify-between w-full border-black border-b-lime-500 bg-black max-w-[222px]"
          onClick={handleOpenBooster}
        >
          Open Booster
        </Button>
      )}
    </div>
  );
});

export const BuyPacks = ({ set }: { set: CardSetType }) => {
  const modal = useModal(ConfirmPurchase);

  const openBooster = useModal(OpenBooster);

  return (
    <>
      <Button
        variant="fancy"
        className="text-black font-bold flex items-center justify-between w-full"
      >
        <span className="text-2xl">1 Pack</span>
        <span className="font-bold text-3xl">100</span>
      </Button>

      <Button
        variant="fancy"
        className="text-black font-bold flex items-center justify-between w-full"
        style={{
          // @ts-expect-error -- types does not support css variables
          "--color": "blue",
        }}
        onClick={() => {
          modal.show({
            onConfirm: () => {
              openBooster.show({ set });
            },
            set,
            price: 1000,
          });
        }}
      >
        <span className="text-2xl">10 Pack</span>
        <span className="font-bold text-3xl">1000</span>
      </Button>
    </>
  );
};

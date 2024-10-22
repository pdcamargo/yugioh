"use client";

import { useMemo } from "react";

import { useToast } from "~/hooks/use-toast";

import { CardThumbnail } from "./card-thumbnail";

import {
  getCardArt,
  getCopiesInDeck,
  groupUserCards,
  isExtraDeckCard,
  isCardInDeck,
  useCreateDeckStore,
} from "../create-deck-store";

export const AvailableCards = () => {
  const mainDeck = useCreateDeckStore((store) => store.mainDeck);
  const extraDeck = useCreateDeckStore((store) => store.extraDeck);
  const cards = useCreateDeckStore((store) => store.cards);
  const setInfoCard = useCreateDeckStore((store) => store.setSelectedCard);
  const addCardToMainDeck = useCreateDeckStore(
    (store) => store.addMainDeckCard,
  );
  const addCardToExtraDeck = useCreateDeckStore(
    (store) => store.addExtraDeckCard,
  );

  const groupedCards = useMemo(() => groupUserCards(cards), [cards]);

  const { toast } = useToast();

  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-4 p-2">
      {groupedCards.map((card) => {
        const copies = getCopiesInDeck(card, mainDeck, extraDeck);

        const isForbidden = card.banlist_info?.ban_tcg === "Forbidden";

        const isLimited = card.banlist_info?.ban_tcg === "Limited";
        const isSemiLimited = card.banlist_info?.ban_tcg === "Semi-Limited";

        return (
          <CardThumbnail
            key={card.id}
            onClick={() => {
              setInfoCard(card);
            }}
            onContextMenu={(e) => {
              e.preventDefault();

              if (isForbidden) {
                return;
              }

              if (isLimited && copies >= 1) {
                toast({
                  title:
                    "Only a single copy of a limited card is allowed per deck",
                  variant: "screen",
                  duration: 3000,
                });

                return;
              }

              if (isSemiLimited && copies >= 2) {
                toast({
                  title:
                    "Only two copies of a semi-limited card is allowed per deck",
                  variant: "screen",
                  duration: 3000,
                });

                return;
              }

              if (
                (copies >= card.quantity || copies >= 3) &&
                card.quantity > 3
              ) {
                toast({
                  title: "You have reached the maximum copies of this card",
                  variant: "screen",
                  duration: 3000,
                });

                return;
              }

              if (copies >= card.quantity) {
                toast({
                  title: "You don't have any more copies of this card",
                  variant: "screen",
                  duration: 3000,
                });

                return;
              }

              if (mainDeck.length + extraDeck.length >= 80) {
                toast({
                  title:
                    "You have reached the maximum number of cards in your deck",
                  variant: "screen",
                  duration: 3000,
                });

                return;
              }

              if (isExtraDeckCard(card)) {
                addCardToExtraDeck({
                  ...card,
                  id: card.ids[copies],
                });
              } else {
                addCardToMainDeck({
                  ...card,
                  id: card.ids[copies],
                });
              }
            }}
            card={card}
            copies={copies}
            quantity={card.quantity}
          />
        );
      })}

      {cards.length === 0 && <div>No cards available</div>}
    </div>
  );
};

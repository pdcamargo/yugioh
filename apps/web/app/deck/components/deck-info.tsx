"use client";

import { Input } from "~/components/ui/input";

import { CardThumbnail } from "./card-thumbnail";

import { useCreateDeckStore } from "../create-deck-store";

export const DeckInfo = () => {
  const deckName = useCreateDeckStore((store) => store.deckName);
  const setDeckName = useCreateDeckStore((store) => store.setDeckName);

  const mainDeck = useCreateDeckStore((store) => store.mainDeck);
  const extraDeck = useCreateDeckStore((store) => store.extraDeck);
  const setInfoCard = useCreateDeckStore((store) => store.setSelectedCard);
  const removeFromMainDeck = useCreateDeckStore(
    (store) => store.removeMainDeckCard,
  );
  const removeFromExtraDeck = useCreateDeckStore(
    (store) => store.removeExtraDeckCard,
  );

  return (
    <>
      <div className="w-full flex-1 overflow-hidden flex flex-col">
        <div className="bg-gray-500 flex items-center gap-3 px-4 py-1 mb-2">
          <img
            src="/ui/general/deck-box.png"
            alt="Deck Box Icon"
            className="w-7 h-auto"
          />

          <Input
            placeholder="Deck Name"
            variant="outline"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </div>

        <div className="bg-gray-500 flex items-center gap-12 px-4 py-1">
          <span className="text-gray-300 text-lg font-bold">Main Deck</span>

          <span className="text-gray-300 text-lg font-bold">
            {mainDeck.length}
          </span>
        </div>

        <div className="grid grid-cols-9 gap-2 p-2 overflow-y-auto">
          {mainDeck.map((card) => {
            return (
              <CardThumbnail
                key={card.id}
                card={card}
                onClick={() => {
                  setInfoCard(card);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();

                  removeFromMainDeck(card);
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="w-full h-[230px] min-h-[230px]">
        <div className="bg-gray-500 flex items-center gap-12 px-4 py-1">
          <span className="text-gray-300 text-lg font-bold">Extra Deck</span>

          <span className="text-gray-300 text-lg font-bold">
            {extraDeck.length}
          </span>
        </div>

        <div className="grid grid-cols-9 gap-2 p-2">
          {extraDeck.map((card) => {
            return (
              <CardThumbnail
                key={card.id}
                card={card}
                onClick={() => {
                  setInfoCard(card);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();

                  removeFromExtraDeck(card);
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

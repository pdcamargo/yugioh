"use client";

import { createContext, useContext, useRef } from "react";

import { produce } from "immer";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import type { PlayerCardType } from "~/server/queries/deck.query";

type State = {
  deckId: string | null;

  deckName: string;

  mainDeck: PlayerCardType[];
  extraDeck: PlayerCardType[];
  cards: PlayerCardType[];

  selectedCard: PlayerCardType | null;
};

type Actions = {
  addMainDeckCard: (card: PlayerCardType) => void;
  addExtraDeckCard: (card: PlayerCardType) => void;
  removeMainDeckCard: (card: PlayerCardType) => void;
  removeExtraDeckCard: (card: PlayerCardType) => void;

  setSelectedCard: (card: PlayerCardType | null) => void;

  setDeckName: (name: string) => void;
};

type CreateDeckStore = State & Actions;

export const createCreateDeckStore = ({
  deckId,
  deckName,
  cards = [],
  mainDeck = [],
  extraDeck = [],
}: {
  cards?: PlayerCardType[];
  deckId?: string;
  mainDeck?: PlayerCardType[];
  extraDeck?: PlayerCardType[];
  deckName?: string;
}) =>
  createStore<CreateDeckStore>()((set) => ({
    deckId: deckId || null,
    deckName: deckName || "",
    cards,
    mainDeck,
    extraDeck,
    selectedCard: null,
    setDeckName(name) {
      set(
        produce((state: CreateDeckStore) => {
          state.deckName = name;
        }),
      );
    },
    setSelectedCard(card) {
      set(
        produce((state: CreateDeckStore) => {
          state.selectedCard = card;
        }),
      );
    },
    addExtraDeckCard: (card) =>
      set(
        produce((state: CreateDeckStore) => {
          state.extraDeck.push(card);
        }),
      ),
    addMainDeckCard: (card) =>
      set(
        produce((state: CreateDeckStore) => {
          state.mainDeck.push(card);
        }),
      ),
    removeExtraDeckCard: (card) =>
      set(
        produce((state: CreateDeckStore) => {
          state.extraDeck = state.extraDeck.filter((c) => c.id !== card.id);
        }),
      ),
    removeMainDeckCard: (card) =>
      set(
        produce((state: CreateDeckStore) => {
          state.mainDeck = state.mainDeck.filter((c) => c.id !== card.id);
        }),
      ),
  }));

export type CreateDeckStoreApi = ReturnType<typeof createCreateDeckStore>;

const CreateDeckStoreContext = createContext<CreateDeckStoreApi | undefined>(
  undefined,
);

export const CreateDeckStoreProvider = ({
  children,
  cards,
  deckId,
  mainDeck,
  extraDeck,
  deckName,
}: {
  children: React.ReactNode;
  cards: PlayerCardType[];
  mainDeck?: PlayerCardType[];
  extraDeck?: PlayerCardType[];
  deckId?: string;
  deckName?: string;
}) => {
  const storeRef = useRef<CreateDeckStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createCreateDeckStore({
      cards,
      deckId,
      mainDeck,
      extraDeck,
      deckName,
    });
  }

  return (
    <CreateDeckStoreContext.Provider value={storeRef.current}>
      {children}
    </CreateDeckStoreContext.Provider>
  );
};

export const useCreateDeckStore = <T,>(
  selector: (store: CreateDeckStore) => T,
): T => {
  const createDeckStoreContext = useContext(CreateDeckStoreContext);

  if (!createDeckStoreContext) {
    throw new Error(
      `useCreateDeckStore must be used within CreateDeckStoreProvider`,
    );
  }

  return useStore(createDeckStoreContext, selector);
};

export const getCardArt = (card: any, artId: string) => {
  return card.cardImages.find(
    (art: any) => art.id.toString() === artId.toString(),
  ).imageUrl as string;
};

export const isExtraDeckCard = (card: PlayerCardType) => {
  const includes = ["xyz", "fusion", "synchro", "link"];

  return includes.some((type) => card.type.toLowerCase().includes(type));
};

export const isNotExtraDeckCard = (card: PlayerCardType) => {
  return !isExtraDeckCard(card);
};

export function groupUserCards(cards: PlayerCardType[]): (PlayerCardType & {
  quantity: number;
  ids: string[];
})[] {
  const cardMap = new Map<
    string,
    PlayerCardType & {
      quantity: number;
      ids: string[];
    }
  >();

  for (const card of cards) {
    const key = `${card.cardId}:${card.artId}:${card.rarity}`;

    if (cardMap.has(key)) {
      const existingCard = cardMap.get(key)!;
      existingCard.quantity++;
    } else {
      cardMap.set(key, {
        ...card,
        quantity: 1,
        ids: cards
          .filter(
            (c) =>
              c.cardId === card.cardId &&
              c.artId === card.artId &&
              c.rarity === card.rarity,
          )
          .map((c) => c.id),
      });
    }
  }

  return Array.from(cardMap.values());
}

export function getCopiesInDeck(
  card: PlayerCardType,
  mainDeck: PlayerCardType[],
  extraDeck: PlayerCardType[],
): number {
  return (
    mainDeck.filter((c) => c.cardId === card.cardId).length +
    extraDeck.filter((c) => c.cardId === card.cardId).length
  );
}

export function ungroupUserCards(
  cards: (PlayerCardType & { quantity: number })[],
) {
  return cards.flatMap((card) => {
    return Array.from({ length: card.quantity }).map(() => card);
  });
}

export function isCardInDeck(card: PlayerCardType, deck: PlayerCardType[]) {
  return deck.some((c) => c.id === card.id);
}

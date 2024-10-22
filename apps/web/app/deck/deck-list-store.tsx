"use client";

import { createContext, useContext, useRef } from "react";

import { produce } from "immer";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

type State = {
  mode: "view" | "delete";
  selectedDecks: string[];
};

type Actions = {
  setMode: (mode: "view" | "delete") => void;

  clearSelectedDecks: () => void;
  selectDeck: (deckId: string) => void;
  deselectDeck: (deckId: string) => void;
  toggleSelectedDeck: (deckId: string) => void;
};

type DeckListStore = State & Actions;

export const createDeckListStore = ({ mode }: { mode?: "view" | "delete" }) =>
  createStore<DeckListStore>()((set) => ({
    mode: mode || "view",
    selectedDecks: [],
    setMode(mode) {
      set(
        produce((state: DeckListStore) => {
          state.mode = mode;
        }),
      );
    },
    toggleSelectedDeck(deckId) {
      set(
        produce((state: DeckListStore) => {
          if (state.selectedDecks.includes(deckId)) {
            state.selectedDecks = state.selectedDecks.filter(
              (selectedDeckId) => selectedDeckId !== deckId,
            );
          } else {
            state.selectedDecks.push(deckId);
          }
        }),
      );
    },
    clearSelectedDecks() {
      set(
        produce((state: DeckListStore) => {
          state.selectedDecks = [];
        }),
      );
    },
    deselectDeck(deckId) {
      set(
        produce((state: DeckListStore) => {
          state.selectedDecks = state.selectedDecks.filter(
            (selectedDeckId) => selectedDeckId !== deckId,
          );
        }),
      );
    },
    selectDeck(deckId) {
      set(
        produce((state: DeckListStore) => {
          state.selectedDecks.push(deckId);
        }),
      );
    },
  }));

export type DeckListStoreApi = ReturnType<typeof createDeckListStore>;

const DeckListStoreContext = createContext<DeckListStoreApi | undefined>(
  undefined,
);

export const DeckListStoreProvider = ({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: "view" | "delete";
}) => {
  const storeRef = useRef<DeckListStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createDeckListStore({
      mode,
    });
  }

  return (
    <DeckListStoreContext.Provider value={storeRef.current}>
      {children}
    </DeckListStoreContext.Provider>
  );
};

export const useDeckListStore = <T,>(
  selector: (store: DeckListStore) => T,
): T => {
  const deckListStoreContext = useContext(DeckListStoreContext);

  if (!deckListStoreContext) {
    throw new Error(
      `useDeckListStore must be used within DeckListStoreProvider`,
    );
  }

  return useStore(deckListStoreContext, selector);
};

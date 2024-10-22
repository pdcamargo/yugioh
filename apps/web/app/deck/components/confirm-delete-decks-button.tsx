"use client";

import { Button } from "~/components/ui/button";
import { useMutation } from "~/hooks/use-mutation";
import { deleteDeck } from "~/server/actions/deck.action";

import { useDeckListStore } from "../deck-list-store";

export const ConfirmDeleteDecks = () => {
  const selectedDecks = useDeckListStore((state) => state.selectedDecks);
  const mode = useDeckListStore((state) => state.mode);

  const { mutate, isLoading } = useMutation({
    mutation: async () => {
      return Promise.all(selectedDecks.map((deckId) => deleteDeck({ deckId })));
    },
  });

  if (mode === "view") {
    return null;
  }

  return (
    <Button
      size="lg"
      variant="destructive"
      isLoading={isLoading}
      onClick={mutate}
      disabled={selectedDecks.length === 0}
    >
      {isLoading ? "Deleting..." : "Delete selected decks"}
    </Button>
  );
};

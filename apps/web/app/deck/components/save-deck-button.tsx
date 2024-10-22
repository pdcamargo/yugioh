"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { useMutation } from "~/hooks/use-mutation";
import { useToast } from "~/hooks/use-toast";
import { createDeck, updateDeck } from "~/server/actions/deck.action";

import { useCreateDeckStore } from "../create-deck-store";

export const SaveDeck = () => {
  const { toast } = useToast();

  const { push } = useRouter();

  const deckId = useCreateDeckStore((store) => store.deckId);
  const mainDeck = useCreateDeckStore((store) => store.mainDeck);
  const extraDeck = useCreateDeckStore((store) => store.extraDeck);
  const deckName = useCreateDeckStore((store) => store.deckName);

  const deck = [...mainDeck, ...extraDeck].map((card) => {
    return {
      userCardId: card.id,
    };
  });

  const { mutate: createDeckMutation, isLoading: isCreatingDeck } = useMutation(
    {
      mutation: (data) => createDeck(data as any),
      onSuccess: (response) => {
        toast({
          title: "Deck created",
          duration: 2000,
          variant: "screen",
        });

        push(`/deck/${response?.data?.id}`);
      },
    },
  );

  const { mutate: updateDeckMutation, isLoading: isUpdatingDeck } = useMutation(
    {
      mutation: (data) => updateDeck(data as any),
      onSuccess: () => {
        toast({
          title: "Deck saved",
          duration: 2000,
          variant: "screen",
        });
      },
    },
  );

  return (
    <Button
      size="lg"
      isLoading={isCreatingDeck || isUpdatingDeck}
      loadingText="Saving..."
      onClick={() => {
        if (!deckId) {
          createDeckMutation({
            name: deckName,
            cards: deck,
          });

          return;
        }

        updateDeckMutation({
          deckId,
          name: deckName,
          cards: deck,
        });
      }}
    >
      Save
    </Button>
  );
};

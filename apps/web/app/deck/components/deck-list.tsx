"use client";

import Link from "next/link";
import { useEventListener } from "usehooks-ts";

import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import { PlayerDeckType } from "~/server/queries/deck.query";

import { useDeckListStore } from "../deck-list-store";

const DeckWrapper = ({
  mode,
  className,
  href,
  children,
}: {
  mode: "view" | "delete";
  className?: string;
  href?: string;
  children: React.ReactNode;
}) => {
  if (mode === "delete") {
    return (
      <label
        className={cn(
          "rounded-xl relative border-2 border-white/50 p-4 bg-zinc-950 text-zinc-200 shadow-lg inner-glow-white flex items-center justify-center flex-col gap-2 h-[220px] hover:cursor-pointer transition-transform hover:scale-105 hover:text-yellow-500 hover:inner-glow-yellow-500 hover:border-yellow-300",
          className,
        )}
      >
        {children}
      </label>
    );
  }

  return (
    <Link
      href={href!}
      className={cn(
        "rounded-xl border-2 border-white/50 p-4 bg-zinc-950 text-zinc-200 shadow-lg inner-glow-white flex items-center justify-center flex-col gap-2 h-[220px] hover:cursor-pointer transition-transform hover:scale-105 hover:text-yellow-500 hover:inner-glow-yellow-500 hover:border-yellow-300",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export const DeckList = ({ decks }: { decks: PlayerDeckType[] }) => {
  const mode = useDeckListStore((store) => store.mode);
  const setMode = useDeckListStore((store) => store.setMode);
  const clearSelectedDecks = useDeckListStore(
    (store) => store.clearSelectedDecks,
  );
  const selectedDecks = useDeckListStore((store) => store.selectedDecks);
  const toggleSelectedDeck = useDeckListStore(
    (store) => store.toggleSelectedDeck,
  );

  useEventListener("keydown", (event) => {
    const isEscape = event.key === "Escape";

    if (isEscape && mode === "delete") {
      setMode("view");
      clearSelectedDecks();
    }
  });

  return (
    <>
      {decks.map((deck) => {
        return (
          <DeckWrapper key={deck.id} mode={mode} href={`/deck/${deck.id}`}>
            {mode === "delete" && (
              <Checkbox
                className="animate-in fade-in zoom-in animate-out zoom-out fade-out"
                checked={selectedDecks.includes(deck.id)}
                onCheckedChange={() => toggleSelectedDeck(deck.id)}
              />
            )}

            <img
              src="/ui/general/deck-box.png"
              alt="Deck Box Icon"
              className="w-28 h-auto"
            />

            <span className="font-bold text-white text-lg">{deck.name}</span>
          </DeckWrapper>
        );
      })}
    </>
  );
};

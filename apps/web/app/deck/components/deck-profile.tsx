"use client";

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { PlayerCardType } from "~/server/queries/deck.query";

import { AvailableCards } from "./available-cards";
import { CardInfo } from "./card-info";
import { DeckInfo } from "./deck-info";
import { SaveDeck } from "./save-deck-button";

import { CreateDeckStoreProvider } from "../create-deck-store";

export const DeckProfile = ({
  cards,
  deckId,
  mainDeck,
  extraDeck,
  deckName,
}: {
  cards: PlayerCardType[];
  mainDeck?: PlayerCardType[];
  extraDeck?: PlayerCardType[];
  deckId?: string;
  deckName?: string;
}) => {
  return (
    <CreateDeckStoreProvider
      cards={cards}
      deckId={deckId}
      mainDeck={mainDeck}
      extraDeck={extraDeck}
      deckName={deckName}
    >
      <div className="w-screen h-screen overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

        <div className="flex items-center justify-between absolute top-0 left-0 right-0 py-10 px-10 bg-black/30 border-b-2 border-b-gray-400">
          <PageHeader>{deckId ? "Edit Deck" : "Create Deck"}</PageHeader>

          <div className="ml-auto justify-self-end">
            <SaveDeck />
          </div>
        </div>

        <div className="absolute top-32 pb-36 w-full left-[50%] translate-x-[-50%] flex items-start justify-between px-10 flex-1 h-full gap-5 text-white">
          <div className="border-2 border-gray-400 h-full w-[24vw] bg-zinc-900">
            <CardInfo />
          </div>

          <div className="border-2 flex flex-col border-gray-400 h-full w-[54vw] bg-zinc-900">
            <DeckInfo />
          </div>

          <div className="border-2 border-gray-400 h-full w-[30vw] bg-zinc-900">
            <AvailableCards />
          </div>
        </div>
      </div>
    </CreateDeckStoreProvider>
  );
};

import Link from "next/link";
import { FaPlus, FaChevronLeft } from "react-icons/fa";

import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { getDecks } from "~/server/queries/deck.query";

import { ConfirmDeleteDecks } from "./components/confirm-delete-decks-button";
import { DeckList } from "./components/deck-list";
import { DeleteDecks } from "./components/delete-decks-button";
import { DeckListStoreProvider } from "./deck-list-store";

export default async function DeckPage() {
  const decks = await getDecks();

  return (
    <DeckListStoreProvider>
      <div className="w-screen h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

        <div className="absolute bottom-0 left-0 right-0 py-5 px-10 bg-black/70 flex items-center justify-end">
          <ConfirmDeleteDecks />
        </div>

        <div className="flex items-center justify-between absolute top-0 left-0 right-0 py-7 px-10 bg-black/30 border-b-2 border-b-gray-400">
          <PageHeader>My Decks</PageHeader>

          <ul className="list-none flex items-center gap-5 text-xl text-white font-bold">
            <li>
              <DeleteDecks />
            </li>

            <li>Number of Decks: {decks.length}/20</li>
          </ul>
        </div>

        <div className="absolute top-32 w-full container left-[50%] translate-x-[-50%] grid grid-cols-5 gap-5">
          <Link
            href="/deck/create"
            className="rounded-xl border-2 border-white/50 p-4 bg-zinc-950 text-zinc-200 shadow-lg inner-glow-white flex items-center justify-center h-[220px] hover:cursor-pointer transition-transform hover:scale-105 hover:text-yellow-500 hover:inner-glow-yellow-500 hover:border-yellow-300"
          >
            <FaPlus className="text-[50px]" />
          </Link>

          <DeckList decks={decks} />
        </div>
      </div>
    </DeckListStoreProvider>
  );
}

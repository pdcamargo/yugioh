import { notFound } from "next/navigation";

import { getDeck } from "~/server/queries/deck.query";
import { getSessionUser } from "~/server/queries/user.query";

import { Queue } from "./queue";

export default async function DuelQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const deckId = (await searchParams).deckId;

  if (!deckId) {
    notFound();
  }

  const deck = await getDeck({ deckId });

  if (!deck) {
    notFound();
  }

  const user = await getSessionUser();

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
      <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

      <div className="absolute w-full h-full container left-[50%] translate-x-[-50%] flex flex-col items-center justify-center gap-10">
        <Queue deckId={deckId} user={user} />
      </div>
    </div>
  );
}

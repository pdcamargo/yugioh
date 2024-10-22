import { getPlayerCards } from "~/server/queries/deck.query";

import { DeckProfile } from "../components/deck-profile";

export default async function CreateDeckPage() {
  const cards = await getPlayerCards();

  return <DeckProfile cards={cards} />;
}

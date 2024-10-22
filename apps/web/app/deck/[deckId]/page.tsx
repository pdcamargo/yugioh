import {
  getDeck,
  getPlayerCards,
  type PlayerCardType,
} from "~/server/queries/deck.query";

import { DeckProfile } from "../components/deck-profile";

const isExtraDeckCard = (card: PlayerCardType) => {
  const includes = ["xyz", "fusion", "synchro", "link"];

  return includes.some((type) => card.type.toLowerCase().includes(type));
};

const isNotExtraDeckCard = (card: PlayerCardType) => {
  return !isExtraDeckCard(card);
};

export default async function UpdateDeckPage({
  params,
}: {
  params: {
    deckId: string;
  };
}) {
  const cards = await getPlayerCards();

  const deck = await getDeck({
    deckId: params.deckId,
  });

  return (
    <DeckProfile
      cards={cards}
      deckId={params.deckId}
      extraDeck={deck.cards.filter((card) => isExtraDeckCard(card))}
      mainDeck={deck.cards.filter((card) => isNotExtraDeckCard(card))}
      deckName={deck.name}
    />
  );
}

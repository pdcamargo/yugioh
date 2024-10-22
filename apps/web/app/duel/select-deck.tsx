"use client";

import { useState } from "react";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { PlayerDeckType } from "~/server/queries/deck.query";

export const SelectDeck = ({ decks }: { decks: PlayerDeckType[] }) => {
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(0);

  return (
    <>
      <Carousel
        className="w-full max-w-xs mx-auto"
        opts={{
          loop: true,
        }}
        onIndexChange={(index) => {
          setSelectedDeckIndex(index);
        }}
      >
        <CarouselContent>
          {decks.map((deck) => (
            <CarouselItem key={deck.id}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center gap-3 flex-col p-6">
                    <img
                      src="/ui/general/deck-box.png"
                      className="w-16 h-auto"
                    />

                    <CardTitle>{deck.name}</CardTitle>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Button
        variant="fancy"
        className="text-black uppercase font-bold py-7 text-2xl"
        asChild
      >
        <Link href={`/duel/queue?deckId=${decks[selectedDeckIndex].id}`}>
          Duel
        </Link>
      </Button>
    </>
  );
};

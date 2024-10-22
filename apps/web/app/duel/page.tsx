import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { getDecks } from "~/server/queries/deck.query";

import { SelectDeck } from "./select-deck";

const links = [
  {
    title: "Details",
    href: "/duel/details",
  },
  {
    title: "Match history",
    href: "/duel/match-history",
  },
  {
    title: "Ranking",
    href: "/duel/ranking",
  },
];

export default async function DuelPage() {
  const decks = await getDecks();

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
      <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

      <div className="flex items-center justify-between absolute top-0 left-0 right-0 py-7 px-10 bg-black/30 border-b-2 border-b-gray-400">
        <PageHeader>Duel</PageHeader>
      </div>

      <div className="absolute top-32 w-full container left-[50%] translate-x-[-50%] flex items-start justify-start gap-12">
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>22:00 - 19:30</CardTitle>
          </CardHeader>
          <CardContent>Olá</CardContent>
        </Card>

        <div className="w-[420px] flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link href={link.href}>
                <Card className="flex-1 w-full rounded-sm">
                  <CardHeader className="flex flex-row py-2 items-center justify-between space-y-0">
                    <CardTitle className="text-lg">22:00 - 19:30</CardTitle>

                    <ChevronRight />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <SelectDeck decks={decks} />
        </div>
      </div>
    </div>
  );
}

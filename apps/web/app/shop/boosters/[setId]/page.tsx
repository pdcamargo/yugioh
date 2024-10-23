import { notFound } from "next/navigation";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { getSet, getSets } from "~/server/queries/sets.query";
import { getSessionUser } from "~/server/queries/user.query";
import { BuyPacks } from "./buy-packs";

export default async function SetBoosterPage({
  params,
}: {
  params: { setId: string };
}) {
  const set = await getSet({
    setId: params.setId,
  });

  const user = await getSessionUser();

  if (!set) {
    notFound();
  }

  const displayCards = (() => {
    const ultraRareCards = set.cards
      .filter((card) => card.rarity === "Ultra Rare")
      .concat(set.cards.filter((card) => card.rarity === "Super Rare"));

    const topFiveMost = ultraRareCards.slice(0, 5);

    const topFiveMostWithArtsOfLessWeight = topFiveMost.map((card) => {
      const [art] = card.arts
        .slice()
        .sort((a, b) => a.weight - b.weight)
        .slice(0, 1);

      return {
        ...card,
        art,
      };
    });

    return topFiveMostWithArtsOfLessWeight;
  })();

  return (
    <div>
      <div className="w-screen h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

        <div className="flex items-center justify-between absolute top-0 left-0 right-0 py-7 px-10 bg-black/30 border-b-2 border-b-gray-400">
          <PageHeader backPath="/shop">
            {set.packType} - {set.name}
          </PageHeader>

          <ul className="list-none flex items-center gap-5 text-xl text-white font-bold">
            <li>Gems: {user.gems}</li>
          </ul>
        </div>

        <div className="absolute top-32 w-full container left-[50%] translate-x-[-50%] flex items-start justify-start gap-5">
          <div className="flex flex-col gap-3 flex-1 w-full">
            {displayCards.map((card) => (
              <img
                key={card.name}
                src={card.art.imageUrl}
                alt={card.name}
                className="w-28 h-auto object-cover"
              />
            ))}
          </div>

          <div className="w-[350px] flex flex-col gap-5">
            <p className="text-white font-semibold text-lg">
              {set.description}
            </p>

            <BuyPacks set={set} />
          </div>
        </div>
      </div>
    </div>
  );
}

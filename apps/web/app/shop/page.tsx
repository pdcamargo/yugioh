import Link from "next/link";
import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getSets } from "~/server/queries/sets.query";
import { getSessionUser } from "~/server/queries/user.query";

export default async function ShopPage() {
  const sets = await getSets();
  const user = await getSessionUser();

  return (
    <div>
      <div className="w-screen h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

        <div className="flex items-center justify-between absolute top-0 left-0 right-0 py-7 px-10 bg-black/30 border-b-2 border-b-gray-400">
          <PageHeader>Shop</PageHeader>

          <ul className="list-none flex items-center gap-5 text-xl text-white font-bold">
            <li>Gems: {user.gems}</li>
          </ul>
        </div>

        <div className="absolute top-32 w-full container left-[50%] translate-x-[-50%] grid grid-cols-2 gap-5">
          {sets.map((set) => {
            return (
              <Link href={`/shop/boosters/${set.id}`} key={set.id}>
                <Card className="fancy-card bg-gradient-to-t from-purple-800 to-purple-950">
                  <CardHeader className="bg-gradient-to-b from-black to-transparent">
                    <CardTitle>{set.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gradient-to-t from-purple-800 via-purple-950 to-purple-950 p-0 pb-4">
                    <img
                      src={set.coverImage}
                      alt={set.name}
                      className="w-full h-auto object-cover relative"
                    />

                    <span className="block text-sm p-4">{set.description}</span>

                    <div className="bg-white/20 rounded-lg px-4 py-2 flex items-center justify-center gap-2 w-fit h-fit max-h-fit mx-auto">
                      <span className="text-lg font-bold text-white">
                        1 Pack
                      </span>
                      <span className="text-lime-500 font-bold text-2xl">
                        100
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

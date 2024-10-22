import React from "react";

import Link from "next/link";
import { AiFillFlag } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import { FaGift, FaEnvelope } from "react-icons/fa6";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { cn } from "./lib/utils";
import { getDecks } from "./server/queries/deck.query";

const menus = [
  {
    title: "Duel",
    href: "/duel",
    helperText: "Battle against other players",
  },
  {
    title: "Deck",
    href: "/deck",
    helperText: "Manage your decks",
  },
  {
    title: "Shop",
    href: "/shop",
    helperText: "Buy packs, decks, cards, and more",
  },
  {
    title: "Collection",
    href: "/collection",
    helperText: "View all your cards",
  },
  {
    title: "Story Mode",
    href: "/story",
    helperText: "Play the game story",
  },
];

const headerMenus = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: <FaEnvelope className="text-[35px]" />,
  },
  {
    title: "Missions",
    href: "/missions",
    icon: <AiFillFlag className="text-[35px]" />,
  },
  {
    title: "Gift Box",
    href: "/gift-box",
    icon: <FaGift className="text-[35px]" />,
  },
  {
    title: "Friends",
    href: "/friends",
    icon: <FaHandshake className="text-[35px]" />,
  },
];

export default async function IndexPage() {
  return (
    <div className="w-screen h-screen overflow-hidden text-white">
      <div className="w-full h-full bg-cover bg-[url('/ui/main/main-menu-bg.png')] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />

      <ul className="list-none flex items-center justify-end gap-14 absolute top-0 left-0 right-0 py-8 px-12 bg-gradient-to-b from-black/75 to-transparent">
        {headerMenus.map((menu) => (
          <li key={menu.title}>
            <Link
              href={menu.href}
              className="block p-2 rounded-md flex flex-col items-center justify-center gap-2"
            >
              {menu.icon}

              <span className="font-bold">{menu.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-10 w-fit h-full absolute top-0 py-8 px-12">
        <div className="bg-gray-950 border-4 border-gray-400 rounded-lg drop-shadow-lg flex items-center relative">
          <div className="border-gray-400 border-r-4 overflow-hidden">
            <img
              src="/ui/main/main-menu-bg.png"
              className="w-20 h-20 object-cover"
            />
          </div>

          <div className="flex flex-col self-start h-full">
            <div className="flex flex-col bg-gray-400 text-gray-800 font-bold pl-2 pr-4">
              <span className="text-lg leading-[1]">Patrick Dias</span>
              <span className="text-base">@pdcamargo</span>
            </div>

            <div className="flex flex-1 items-center justify-start pl-2 pr-4 gap-2">
              <span className="text-bold text-lg">LVL. 3</span>

              <div className="w-[200px] flex items-center justify-start h-[8px] rounded-sm bg-black border border-gray-400">
                <div className="w-[50%] h-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        <ul className="list-none w-[300px] flex flex-col gap-7">
          {menus.map((menu, idx) => (
            <TooltipProvider key={menu.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li
                    className={cn(
                      "group font-bold leading-[1] uppercase relative",
                      {
                        "text-[24px]": idx > 0,
                        "text-[40px]": idx === 0,
                      },
                    )}
                    key={menu.title}
                  >
                    <div className="hidden group-hover:block absolute -inset-1 pointer-events-none">
                      <div className="absolute w-4 h-4 bg-lime-500 left-0 top-0" />
                      <div className="absolute w-4 h-4 bg-lime-500 left-0 bottom-0" />
                      <div className="absolute w-4 h-4 bg-lime-500 right-0 top-0" />
                      <div className="absolute w-4 h-4 bg-lime-500 right-0 bottom-0" />
                    </div>
                    <Link
                      className="w-full h-full block border-2 border-transparent drop-shadow-lg px-4 py-2 hover:text-black hover:border-lime-950 hover:bg-gradient-to-b hover:from-lime-500 hover:via-lime-300 hover:to-lime-500 border-l-lime-500"
                      href={menu.href}
                    >
                      {menu.title}
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent side="right" align="center" sideOffset={20}>
                  <span className="text-xl">{menu.helperText}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </ul>
      </div>
    </div>
  );
}

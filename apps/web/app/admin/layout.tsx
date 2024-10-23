"use client";

import React from "react";

import { PageHeader } from "~/components/page-header";

export default function DeckPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/deck-bg.jpg')]"></div>
        <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/ui/main/bg-particle.webp')] mix-blend-screen"></div>

        <div className="flex items-center justify-between absolute top-0 left-0 right-0 py-7 px-10 bg-black/30 border-b-2 border-b-gray-400">
          <PageHeader backPath="/admin">Admin</PageHeader>

          {/* <ul className="list-none flex items-center gap-5 text-xl text-white font-bold">
            <li>
              <DeleteDecks />
            </li>

            <li>Number of Decks: {decks.length}/20</li>
          </ul> */}
        </div>

        <div className="absolute top-32 w-full container left-[50%] translate-x-[-50%]">
          {children}
        </div>
      </div>
    </>
  );
}

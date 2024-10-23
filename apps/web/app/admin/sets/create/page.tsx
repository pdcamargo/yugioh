"use client";

import { CardSet } from "@prisma/client";
import Image from "next/image";
import React, { forwardRef, useState } from "react";

import { VirtuosoGrid } from "react-virtuoso";

import cardsData from "~/cards.json";

const gridComponents = {
  List: forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; style: React.CSSProperties }
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: { children: React.ReactNode }) => (
    <div
      {...props}
      style={{
        padding: "0.5rem",
        width: "20%",
        display: "flex",
        flex: "none",
        alignContent: "stretch",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  ),
};

const ItemWrapper = ({ children, ...props }: { children: React.ReactNode }) => (
  <div
    {...props}
    style={{
      display: "flex",
      flex: 1,
      textAlign: "center",
      padding: "1rem 1rem",
      border: "1px solid gray",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export default function CreateSetPage() {
  const [selectedCards, setSelectedCards] = useState<CardSet["cards"]>([]);

  return (
    <div className="w-full h-full flex-1">
      <VirtuosoGrid
        style={{ height: 500 }}
        totalCount={cardsData.length}
        components={gridComponents}
        data={cardsData as Array<CardJsonInfo>}
        itemContent={(index, card) => (
          <ItemWrapper>
            <Image
              src={card.cardImages[0].imageUrl}
              alt={card.name}
              width={194}
              height={283}
              loading="lazy"
            />
          </ItemWrapper>
        )}
      />
      {/* {(cardsData as Array<any>).map((card) => (
        <div key={card.id} className="w-24 h-auto">
          <img
            src={card.cardImages[0].imageUrl}
            alt={card.name}
            className="w-24 h-auto"
          />
        </div>
      ))} */}
    </div>
  );
}

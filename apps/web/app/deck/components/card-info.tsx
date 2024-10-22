"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

import { getCardArt, useCreateDeckStore } from "../create-deck-store";

const frameColorVariants = cva("bg-gradient-to-r border", {
  variants: {
    variant: {
      fusion: "from-[#532460] to-[#933eab] border-[#794697]",
      normal: "from-[#3c2214] to-[#a75426] border-[#7d4c35]",
      spell: "from-[#045c4e] to-[#05937e] border-[#249587]",
      trap: "from-[#3b072d] to-[#9f0c70] border-[#9b387f]",
      effect: "from-[#402212] to-[#a95526] border-[#89563e]",
    },
  },
});

type VP = VariantProps<typeof frameColorVariants>;

const attributeIcons: Record<string, string> = {
  DARK: "/ui/general/icons/dark-icon.webp",
  DIVINE: "/ui/general/icons/divine-icon.webp",
  EARTH: "/ui/general/icons/earth-icon.webp",
  FIRE: "/ui/general/icons/fire-icon.webp",
  LIGHT: "/ui/general/icons/light-icon.webp",
  spell: "/ui/general/icons/spell-icon.webp",
  trap: "/ui/general/icons/trap-icon.webp",
  WATER: "/ui/general/icons/water-icon.webp",
  WIND: "/ui/general/icons/wind-icon.webp",
};

export const CardInfo = () => {
  const selectedCard = useCreateDeckStore((store) => store.selectedCard);

  if (!selectedCard) {
    return null;
  }

  const art = getCardArt(selectedCard, selectedCard.artId);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "text-lg font-bold text-white px-2 py-3 flex items-center justify-between",
          frameColorVariants({
            variant: selectedCard.frameType as VP["variant"],
          }),
        )}
      >
        <span>{selectedCard.name}</span>

        <img
          src={attributeIcons[selectedCard.attribute || selectedCard.frameType]}
          alt={selectedCard.attribute || selectedCard.frameType}
          className="block w-7 h-7 rounded-full shadow-lg border border-black/60"
        />
      </div>
      <div className="flex items-start px-2 gap-2 bg-">
        <img src={art} alt={selectedCard.name} className="w-32 h-auto" />

        <div>
          {!(selectedCard?.level || selectedCard.atk || selectedCard.def) && (
            <span className="text-xl font-bold text-white">
              {selectedCard.humanReadableCardType}
            </span>
          )}
          {!!selectedCard?.level && (
            <div className="flex items-center gap-1">
              <img
                src="/ui/general/icons/star-icon.webp"
                alt="Level"
                className="block w-5 h-5 rounded-full shadow-lg border border-black/60"
              />
              <span className="text-xl font-bold text-white">
                {selectedCard.level}
              </span>
            </div>
          )}
          {!!selectedCard?.atk && (
            <div className="flex items-center gap-1">
              <img
                src="/ui/general/icons/star-icon.webp"
                alt="Level"
                className="block w-5 h-5 rounded-full shadow-lg border border-black/60"
              />
              <span className="text-xl font-bold text-white">
                {selectedCard.atk}
              </span>
            </div>
          )}
          {!!selectedCard?.def && (
            <div className="flex items-center gap-1">
              <img
                src="/ui/general/icons/star-icon.webp"
                alt="Level"
                className="block w-5 h-5 rounded-full shadow-lg border border-black/60"
              />
              <span className="text-xl font-bold text-white">
                {selectedCard.def}
              </span>
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          "text-lg font-bold text-white px-2 py-1 flex items-center justify-between",
          frameColorVariants({
            variant: selectedCard.frameType as VP["variant"],
          }),
        )}
      >
        <span>
          {selectedCard.typeline?.join("/") ||
            selectedCard.type.replace("Card", "").trim()}
        </span>
      </div>
      <pre className="text-white px-2 text-wrap font-sans text-lg">
        {selectedCard.desc}
      </pre>
    </div>
  );
};

import { PlayerCardType } from "~/server/queries/deck.query";

import { getCardArt } from "../create-deck-store";

export const CardThumbnail = ({
  card,
  quantity,
  copies,
  onClick,
  onContextMenu,
}: {
  card: PlayerCardType;
  quantity?: number;
  copies?: number;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const art = getCardArt(card, card.artId);

  const isLimited = card.banlist_info?.ban_tcg === "Limited";
  const isSemiLimited = card.banlist_info?.ban_tcg === "Semi-Limited";

  // first letters of both split by space
  const rarityLabel = card.rarity
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <div
      key={card.id}
      className="relative"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <img
        alt={`${card.name}Card art`}
        src={art}
        className="pointer-events-none h-auto"
      />

      {quantity && (
        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs py-0.5 px-2 font-bold">
          {quantity}
        </div>
      )}

      {(isLimited || isSemiLimited) && (
        <div className="absolute left-0 top-0 w-3 h-3 rounded-full border-red-500 bg-black text-yellow-500 flex items-center justify-center font-bold">
          {isLimited ? "1" : "2"}
        </div>
      )}

      <div className="absolute right-0 top-0 rounded text-white font-bold px-2 py-0.5 bg-gray-400">
        {rarityLabel}
      </div>

      {!!copies && (
        <div className="absolute -bottom-[15px] left-0 w-full h-4 flex items-center justify-center gap-2">
          {Array.from({ length: copies }).map((_, index) => (
            <span
              key={index}
              className="bg-yellow-300 w-[10px] h-[10px] rounded-full shadow-lg border border-gray-500"
            />
          ))}
        </div>
      )}
    </div>
  );
};

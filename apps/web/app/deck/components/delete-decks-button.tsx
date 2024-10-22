"use client";

import { FaTrash } from "react-icons/fa";

import { Button } from "~/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";

import { useDeckListStore } from "../deck-list-store";

export const DeleteDecks = () => {
  const mode = useDeckListStore((store) => store.mode);
  const setMode = useDeckListStore((store) => store.setMode);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              if (mode === "view") {
                setMode("delete");
              } else {
                setMode("view");
              }
            }}
          >
            <FaTrash /> {mode === "delete" && "Cancel"}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          {mode === "view" ? "Select decks to delete" : "Cancel delete"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

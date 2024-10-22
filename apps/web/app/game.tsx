"use client";

import { useLayoutEffect } from "react";

import { boilerplate } from "./boilerplate";
import { useSocket } from "./hooks/use-socket";

let runs = 0;

export const Game = () => {
  const socket = useSocket("match");

  useLayoutEffect(() => {
    if (runs > 0) return undefined;

    runs++;

    boilerplate();
  }, []);

  return <div id="game"></div>;
};

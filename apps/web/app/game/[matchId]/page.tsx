"use client";

import { Game } from "../../game";

export default function GamePage({ params }: { params: { matchId: string } }) {
  return <div> matchId={params.matchId}</div>;

  // return <Game />;
}

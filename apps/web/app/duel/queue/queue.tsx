"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

import { useTimeSinceStart } from "~/hooks/use-time-since-start";

import { User } from "@repo/database";

const formatSecondsToReadable = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

type EmitEvents = {
  joinQueue: (
    opt: { deckId: string; userId: string },
    ack: (data: { joinTime: number }) => void,
  ) => void;
};

type ListenEvents = {
  matchFound: (data: { matchId: string; opponentId: string }) => void;
  ping: (data: { message: string }) => void;
};

export const Queue = ({ deckId, user }: { deckId: string; user: User }) => {
  const { push } = useRouter();

  const [joinTime, setJoinTime] = useState<number | null>(null);

  const timeOnQueue = useTimeSinceStart(joinTime);

  const { socket } = useSocket<ListenEvents, EmitEvents>(
    "http://localhost:3333",
  );

  useSocketEvent(socket, "matchFound", {
    onMessage: (data) => {
      alert("Match found!");

      push(`/game/${data.matchId}?opponentId=${data.opponentId}`);
    },
  });

  useEffect(() => {
    if (joinTime === null) {
      socket.emit("joinQueue", { deckId, userId: user.id }, (data) => {
        console.log({ data });
        setJoinTime(data.joinTime);
      });
    }
  }, [deckId, joinTime, socket, user.id]);

  // const joinQueue = useCallback(async () => {
  //   const { joinTime} = await socket.emit("joinQueue", { deckId, userId: user.id });
  // }, []);

  // useEffect(() => {

  // }, []);

  // useOnStartEmit<
  //   {
  //     deckId: string;
  //     userId: string;
  //   },
  //   | {
  //       joinTime: number;
  //     }
  //   | {
  //       matchId: string;
  //       opponentId: string;
  //     }
  // >("joinQueue", { deckId, userId: user.id }, (data) => {
  //   if ("joinTime" in data) {
  //     setJoinTime(data.joinTime);
  //   } else {
  //     alert("Match found!");

  //     push(`/game/${data.matchId}?opponentId=${data.opponentId}`);
  //   }
  // });

  // useOnEvent<{ matchId: string; opponentId: string }>("matchFound", (data) => {
  //   alert("Match found!");

  //   push(`/game/${data.matchId}?opponentId=${data.opponentId}`);
  // });

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center text-white flex-col gap-3">
      {timeOnQueue !== -1 && (
        <>
          <span className="font-bold text-xl text-center">
            Looking for opponent
          </span>
          <span className="font-bold text-white text-xl text-center">
            {formatSecondsToReadable(timeOnQueue)}
          </span>
        </>
      )}
    </div>
  );
};

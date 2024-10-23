import { Server, Socket } from "socket.io";
import {
  ConnectedSocket,
  InjectServer,
  MessageData,
  OnEvent,
  WebSocketController,
} from "../decorators/decorators";

@WebSocketController()
export default class QueueController {
  private queue: YugiohQueue;

  @InjectServer()
  private io!: Server;

  constructor() {
    this.queue = new YugiohQueue();

    setInterval(() => {
      this.processQueue();
    }, 1000);
  }

  private processQueue() {
    const matches = this.queue.processQueue();

    matches.forEach((match) => {
      const { matchId, player1, player2 } = match;

      player1.socket.join(matchId);
      player2.socket.join(matchId);

      this.io.to(player1.socket.id).emit("matchFound", {
        matchId,
        opponent: player2.userId,
      });

      this.io.to(player2.socket.id).emit("matchFound", {
        matchId,
        opponent: player1.userId,
      });
    });
  }

  @OnEvent("joinQueue")
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageData() message: { deckId: string; userId: string },
  ) {
    const joinTime = this.queue.joinQueue(
      message.userId,
      message.deckId,
      1000,
      socket,
    );

    return {
      joinTime,
    };
  }
}

export type YugiohQueuePlayer = {
  userId: string;
  deckId: string;
  playerRating: number;
  joinTime: number;
  socket: Socket;
};

class YugiohQueue {
  private queue: YugiohQueuePlayer[];
  private socketUserMap: Map<string, string>; // Maps socket to userId

  constructor() {
    this.queue = [];
    this.socketUserMap = new Map();
  }

  joinQueue(
    userId: string,
    deckId: string,
    playerRating: number,
    socket: Socket,
  ) {
    if (this.socketUserMap.has(socket.id)) {
      console.log(`User ${userId} is already in the queue.`);
      return this.queue.find((player) => player.userId === userId)!.joinTime;
    }

    // validate if userId is already in the queue
    if (this.queue.find((player) => player.userId === userId)) {
      console.log(`User ${userId} is already in the queue.`);
      // update socket in the map
      this.socketUserMap.set(socket.id, userId);

      // update socket in the player
      const player = this.queue.find((player) => player.userId === userId)!;

      player.socket = socket;

      return player.joinTime;
    }

    const joinTime = Date.now();
    console.log(
      `User ${userId} joined the queue with deck ${deckId}, rating ${playerRating}, at time ${joinTime}.`,
    );
    const player: YugiohQueuePlayer = {
      userId,
      deckId,
      playerRating,
      joinTime,
      socket,
    };
    this.queue.push(player);
    this.socketUserMap.set(socket.id, userId);

    return joinTime;
  }

  leaveQueue(userId: string): void {
    const playerIndex = this.queue.findIndex(
      (player) => player.userId === userId,
    );
    if (playerIndex !== -1) {
      const player = this.queue[playerIndex];
      this.socketUserMap.delete(player.socket.id);
      this.queue.splice(playerIndex, 1);
      console.log(`User ${userId} left the queue.`);
    }
  }

  leaveQueueBySocket(socketId: string): void {
    const userId = this.socketUserMap.get(socketId);
    if (userId) {
      this.leaveQueue(userId);
    }
  }

  isSocketInQueue(socketId: string): boolean {
    return this.socketUserMap.has(socketId);
  }

  getInfosBySocket(socketId: string): YugiohQueuePlayer | null {
    const userId = this.socketUserMap.get(socketId);
    if (userId) {
      return this.queue.find((player) => player.userId === userId) || null;
    }
    return null;
  }

  // Process the queue to find matches
  public processQueue() {
    if (this.queue.length < 2) {
      return [];
    }

    let matchedPlayers: Set<string> = new Set();

    let matchesFound: Array<{
      matchId: string;
      player1: YugiohQueuePlayer;
      player2: YugiohQueuePlayer;
    }> = [];

    for (let i = 0; i < this.queue.length; i++) {
      if (matchedPlayers.has(this.queue[i].userId)) continue;

      const player1 = this.queue[i];
      let closestMatch: YugiohQueuePlayer | null = null;
      let closestDifference = Infinity;

      for (let j = i + 1; j < this.queue.length; j++) {
        if (matchedPlayers.has(this.queue[j].userId)) continue;

        const player2 = this.queue[j];
        const ratingDifference = Math.abs(
          player1.playerRating - player2.playerRating,
        );

        if (ratingDifference < closestDifference) {
          closestDifference = ratingDifference;
          closestMatch = player2;
        }
      }

      if (closestMatch) {
        matchedPlayers.add(player1.userId);
        matchedPlayers.add(closestMatch.userId);

        // Remove matched players from the queue
        this.queue = this.queue.filter(
          (player) =>
            player.userId !== player1.userId &&
            player.userId !== closestMatch.userId,
        );

        // Remove them from the socket map
        this.socketUserMap.delete(player1.socket.id);
        this.socketUserMap.delete(closestMatch.socket.id);

        // Create a match
        const matchId = `${player1.userId}-${closestMatch.userId}`;

        matchesFound.push({
          matchId,
          player1,
          player2: closestMatch,
        });
      }
    }

    return matchesFound;
  }
}

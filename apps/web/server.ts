import next from "next";
import { Server, Socket } from "socket.io";

import { createServer } from "node:http";
import { parse } from "node:url";

type YugiohQueuePlayer = {
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
  public processQueue(): void {
    if (this.queue.length < 2) {
      return; // Not enough players to form a match
    }

    let matchedPlayers: Set<string> = new Set();

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
        console.log(
          `Match found between user ${player1.userId} and user ${closestMatch.userId}.`,
        );
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

        // Callback to notify about the match (this could be replaced with an event emitter, etc.)
        player1.socket.emit("matchFound", {
          matchId: `${player1.userId}-${closestMatch.userId}`,
          opponentId: closestMatch.userId,
        });

        closestMatch.socket.emit("matchFound", {
          matchId: `${player1.userId}-${closestMatch.userId}`,
          opponentId: player1.userId,
        });
      }
    }
  }
}

class Match {
  constructor(
    public matchId: string,
    public player1: YugiohQueuePlayer,
    public player2: YugiohQueuePlayer,
  ) {}
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = +(process.env.PORT || 3000);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  let io: Server;

  const httpServer = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url!, true);
      const { pathname, query } = parsedUrl;

      // add io instance to the request object
      (req as any).io = io;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  io = new Server(httpServer);

  const queue = new YugiohQueue();
  const matches = new Map<string, Match>();

  io.on("connection", (socket) => {
    setInterval(() => {
      socket.emit("ping", { time: Date.now() });

      queue.processQueue();

      console.log(socket.handshake.headers);
    }, 1000);

    socket.on("joinQueue", (data, callback: (data: any) => void) => {
      const { userId, deckId } = data;

      const joinTime = queue.joinQueue(userId, deckId, 1000, socket);

      callback({ joinTime: joinTime || Date.now() });
    });

    socket.on("leaveQueue", (data) => {
      const { userId } = data;
      queue.leaveQueue(userId);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

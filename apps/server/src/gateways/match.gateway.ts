import { Server, Socket } from "socket.io";
import {
  ConnectedSocket,
  InjectServer,
  MessageData,
  OnEvent,
  OnServerSideEvent,
  WebSocketController,
} from "../decorators/decorators";
import { YugiohQueuePlayer } from "./queue.gateway";
import { prisma } from "@repo/database";

type Match = {
  matchId: string;
  player1: YugiohQueuePlayer | null;
  player2: YugiohQueuePlayer | null;
};

@WebSocketController()
export default class MatchController {
  @InjectServer()
  private $io!: Server;

  private matches: Match[] = [];

  private $ongoingMatches: Map<string, YugiohMatch> = new Map();

  @OnEvent("setupMatch")
  async setupMatch(
    @ConnectedSocket() socket: Socket,
    @MessageData() message: { matchId: string; userId: string },
  ) {
    const match = await prisma.match.findFirst({
      where: {
        matchId: message.matchId,
      },
    });
  }
}

export enum MatchPhase {
  DRAW,
  STANDBY,
  MAIN_1,
  BATTLE_START,
  BATTLE_STEP,
  BATTLE_DAMAGE,
  BATTLE_END,
  MAIN_2,
  END,
}

export class YugiohMatchPlayer {
  lifePoints = 8000;

  constructor(
    public id: string,
    public socket: Socket,
    public match: YugiohMatch,
  ) {}

  public get opponent(): YugiohMatchPlayer {
    return this.match.getOpponentFor(this);
  }

  public get isMyTurn(): boolean {
    return this.match.isPlayerTurn(this);
  }

  public draw(amount: number) {}
  public heal(amount: number) {}
  public damage(amount: number) {}
}

export class YugiohMatch {
  players: YugiohMatchPlayer[] = [];

  phase: MatchPhase = MatchPhase.STANDBY;

  currentTurnPlayerId: string = "";

  constructor(
    public server: Server,
    public matchOptions: Match,
  ) {
    this.players = [
      new YugiohMatchPlayer(
        matchOptions.player1.userId,
        matchOptions.player1.socket,
        this,
      ),
      new YugiohMatchPlayer(
        matchOptions.player2.userId,
        matchOptions.player2.socket,
        this,
      ),
    ];
  }

  public getOpponentFor(player: YugiohMatchPlayer): YugiohMatchPlayer {
    return this.players.find((p) => p.id !== player.id)!;
  }

  public isPlayerTurn(player: YugiohMatchPlayer): boolean {
    return player.id === this.currentTurnPlayerId;
  }
}

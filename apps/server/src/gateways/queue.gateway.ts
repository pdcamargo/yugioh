import { Server, Socket } from "socket.io";
import {
  ConnectedServer,
  ConnectedSocket,
  MessageData,
  OnEvent,
  WebSocketController,
} from "../decorators/decorators";

@WebSocketController()
export class QueueController {
  @OnEvent("joinQueue")
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageData() message: { deckId: string; userId: string },
  ) {
    console.log(
      `Received message: ${message.deckId} and ${message.userId} from socket: ${socket.id}`,
    );

    return {
      joinTime: Date.now(),
    };
  }

  @OnEvent("broadcast")
  async handleBroadcast(@ConnectedServer() server: Server, message: string) {
    server.emit("broadcast", { message });
  }
}

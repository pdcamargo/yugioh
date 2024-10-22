import { Server, Socket } from "socket.io";
import "reflect-metadata";

export function applyWebSocketControllers(io: Server, controllers: any[]) {
  console.group("Websocket");

  io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    controllers.forEach((controller) => {
      if (!controller) {
        throw new Error("Websocket Controller not found");
      }

      const instance = new controller();
      const events = Reflect.getMetadata("events", controller) as any[];
      const serverEvents = Reflect.getMetadata(
        "serverEvents",
        controller,
      ) as any[];

      events.forEach((event) => {
        socket.on(event.eventName, async (...args: any[]) => {
          const handlerArgs: any[] = [];

          event.params.forEach((param: any) => {
            switch (param.type) {
              case "socket":
                handlerArgs[param.index] = socket;
                break;
              case "server":
                handlerArgs[param.index] = io;
                break;
              case "messageData":
                handlerArgs[param.index] = args[0];
                break;
              default:
                handlerArgs[param.index] = args[param.index] || undefined;
            }
          });

          const result = await instance[event.handlerName](...handlerArgs);

          // If there is a callback (acknowledgement), send the result back
          if (typeof args[args.length - 1] === "function") {
            const ack = args[args.length - 1];
            ack(result);
          }
        });
      });

      serverEvents.forEach((event) => {
        io.on(event.eventName, async (...args: any[]) => {
          const handlerArgs: any[] = [];

          event.params.forEach((param: any) => {
            switch (param.type) {
              case "socket":
                handlerArgs[param.index] = socket;
                break;
              case "server":
                handlerArgs[param.index] = io;
                break;
              case "messageData":
                handlerArgs[param.index] = args[0];
                break;
              default:
                handlerArgs[param.index] = args[param.index] || undefined;
            }
          });

          const result = await instance[event.handlerName](...handlerArgs);

          // If there is a callback (acknowledgement), send the result back
          if (typeof args[args.length - 1] === "function") {
            const ack = args[args.length - 1];
            ack(result);
          }
        });
      });
    });
  });

  console.groupEnd();
}

import { Server, Socket } from "socket.io";
import "reflect-metadata";

export function applyWebSocketControllers(io: Server, controllers: any[]) {
  console.group("Websocket");

  controllers.forEach((controller) => {
    console.group(controller.name);

    const events = Reflect.getMetadata("events", controller) as any[];
    const serverEvents = Reflect.getMetadata(
      "serverEvents",
      controller,
    ) as any[];

    // log used events
    console.log("Socket Events", events.map((e) => e.eventName).join(", "));
    console.log(
      "Server Events",
      serverEvents.map((e) => e.eventName).join(", "),
    );

    console.groupEnd();
  });

  // pre instantiate controllers
  const instances = controllers.map((controller) => [
    new controller(),
    controller,
  ]);

  io.on("connection", (socket: Socket) => {
    instances.forEach(([instance, controller]) => {
      // Inject Socket instance if the class has `@InjectSocket()`
      const injectSocketPropertyKey = Reflect.getMetadata(
        "injectSocket",
        instance,
      );

      if (injectSocketPropertyKey) {
        instance[injectSocketPropertyKey] = socket;
      }

      // Inject Server (io) instance if the class has `@InjectServer()`
      const injectServerPropertyKey = Reflect.getMetadata(
        "injectServer",
        instance,
      );

      if (injectServerPropertyKey) {
        instance[injectServerPropertyKey] = io;
      }

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

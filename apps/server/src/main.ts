import "reflect-metadata";

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { applyControllers } from "./decorators/controller-loader";
import { applyWebSocketControllers } from "./decorators/websocket-loader";

async function bootstrap() {
  const app = express();
  const server = createServer(app);
  app.use(express.json());

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const PORT = process.env.PORT || 3333;

  // Dynamically load controllers and apply them
  const controllersPath = resolve(__dirname, "controllers");
  const controllerFiles = (await readdir(controllersPath)).filter((file) =>
    file.endsWith(".controller.ts"),
  );
  const controllers = controllerFiles.map(
    (file) => require(resolve(controllersPath, file)).default,
  );
  applyControllers(app, controllers);

  // Dynamically load websocket gateways and apply them
  const gatewaysPath = resolve(__dirname, "gateways");
  const gatewayFiles = (await readdir(gatewaysPath)).filter((file) =>
    file.endsWith(".gateway.ts"),
  );
  const gateways = gatewayFiles.map(
    (file) => require(resolve(gatewaysPath, file)).default,
  );
  applyWebSocketControllers(io, gateways);

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

bootstrap();

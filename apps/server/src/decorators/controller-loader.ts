import express, { Request, Response } from "express";
import "reflect-metadata";

export function applyControllers(app: express.Application, controllers: any[]) {
  console.group("Controllers");
  controllers.forEach((controller) => {
    if (!controller) {
      throw new Error("Websocket Controller not found");
    }

    const instance = new controller();
    const basePath = Reflect.getMetadata("basePath", controller);
    const routes = Reflect.getMetadata("routes", controller) as any[];

    routes.forEach((route) => {
      const fullPath = `${basePath}${route.path}`;
      app[route.method as keyof typeof app](
        fullPath,
        (req: Request, res: Response) => {
          const args: any = [];

          route.params.forEach((param: any) => {
            switch (param.type) {
              case "req":
                args[param.index] = req;
                break;
              case "res":
                args[param.index] = res;
                break;
              case "body":
                args[param.index] = req.body;
                break;
              case "headers":
                args[param.index] = req.headers;
                break;
              case "params":
                args[param.index] = req.params[param.name];
                break;
              case "query":
                args[param.index] = req.query[param.name];
                break;
              default:
                args[param.index] = undefined;
            }
          });

          instance[route.handlerName](...args);
        },
      );
    });
  });
  console.groupEnd();
}

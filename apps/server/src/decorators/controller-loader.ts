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

    console.group(controller.name, basePath);

    const getMethods = routes.filter((route) => route.method === "get");
    const postMethods = routes.filter((route) => route.method === "post");
    const putMethods = routes.filter((route) => route.method === "put");
    const deleteMethods = routes.filter((route) => route.method === "delete");

    console.log(
      "GET",
      getMethods
        .map((route) => (route.path !== "" ? route.path : "/"))
        .join(", "),
    );

    console.log(
      "POST",
      postMethods
        .map((route) => (route.path !== "" ? route.path : "/"))
        .join(", "),
    );

    console.log(
      "PUT",
      putMethods
        .map((route) => (route.path !== "" ? route.path : "/"))
        .join(", "),
    );

    console.log(
      "DELETE",
      deleteMethods
        .map((route) => (route.path !== "" ? route.path : "/"))
        .join(", "),
    );

    console.groupEnd();

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

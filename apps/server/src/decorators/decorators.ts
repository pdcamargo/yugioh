// utils/decorators.ts
import "reflect-metadata";

export function Controller(path: string = ""): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("basePath", path, target);
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
}

export function createRouteDecorator(
  method: "get" | "post" | "put" | "delete",
) {
  return function (path: string = ""): MethodDecorator {
    return (target, propertyKey, descriptor) => {
      if (!Reflect.hasMetadata("routes", target.constructor)) {
        Reflect.defineMetadata("routes", [], target.constructor);
      }

      const routes = Reflect.getMetadata("routes", target.constructor) as any[];
      routes.push({
        method,
        path,
        handlerName: propertyKey,
        params: Reflect.getMetadata("params", target, propertyKey) || [],
      });
      Reflect.defineMetadata("routes", routes, target.constructor);
    };
  };
}

function createParamDecorator(
  type: string,
  paramName?: string,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (!Reflect.hasMetadata("params", target, propertyKey!)) {
      Reflect.defineMetadata("params", [], target, propertyKey!);
    }
    const params = Reflect.getMetadata("params", target, propertyKey!);
    params.push({ type, name: paramName, index: parameterIndex });
    Reflect.defineMetadata("params", params, target, propertyKey!);
  };
}

export const Get = createRouteDecorator("get");
export const Post = createRouteDecorator("post");
export const Put = createRouteDecorator("put");
export const Delete = createRouteDecorator("delete");

export const Req = () => createParamDecorator("req");
export const Res = () => createParamDecorator("res");
export const Body = () => createParamDecorator("body");
export const Headers = () => createParamDecorator("headers");
export const Params = (paramName: string) =>
  createParamDecorator("params", paramName);
export const Query = (paramName: string) =>
  createParamDecorator("query", paramName);
export const ConnectedSocket = () => createParamDecorator("socket");
export const ConnectedServer = () => createParamDecorator("server");
export const MessageData = () => createParamDecorator("messageData");

// WebSocket Decorators
export function WebSocketController(): ClassDecorator {
  return (target) => {
    if (!Reflect.hasMetadata("events", target)) {
      Reflect.defineMetadata("events", [], target);
    }

    if (!Reflect.hasMetadata("serverEvents", target)) {
      Reflect.defineMetadata("serverEvents", [], target);
    }
  };
}

export function OnEvent(eventName: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    if (!Reflect.hasMetadata("events", target.constructor)) {
      Reflect.defineMetadata("events", [], target.constructor);
    }

    const events = Reflect.getMetadata("events", target.constructor) as any[];

    events.push({
      eventName,
      handlerName: propertyKey,
      params: Reflect.getMetadata("params", target, propertyKey) || [],
    });

    Reflect.defineMetadata("events", events, target.constructor);
  };
}

export function OnServerSideEvent(eventName: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    if (!Reflect.hasMetadata("serverEvents", target.constructor)) {
      Reflect.defineMetadata("serverEvents", [], target.constructor);
    }

    const events = Reflect.getMetadata(
      "serverEvents",
      target.constructor,
    ) as any[];

    events.push({
      eventName,
      handlerName: propertyKey,
      params: Reflect.getMetadata("params", target, propertyKey) || [],
    });

    Reflect.defineMetadata("serverEvents", events, target.constructor);
  };
}

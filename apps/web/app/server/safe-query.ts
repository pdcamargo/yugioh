import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { z, ZodSchema } from "zod";

import { prisma } from "@repo/database";

import { authOptions } from "../api/auth/[...nextauth]/auth-options";

export const getSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!session.user || !session.user.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  return { session, user };
};

abstract class QueryWithSchema<T> {
  _schema!: ZodSchema<T>;

  public schema<R>(schema: ZodSchema<R>) {
    this._schema = schema as any;

    return this as unknown as QueryWithSchema<R>;
  }

  public abstract query<R>(
    query: (opt: { parsedInput: z.infer<ZodSchema<T>> }) => Promise<R>,
  ): (input: z.infer<ZodSchema<T>>) => Promise<R>;
}

class SafeQueryWithAuth<T> extends QueryWithSchema<T> {
  // middleware uses next to approve or reject the request
  _middlewares: Array<
    (opt: {
      user: User;
      parsedInput: z.infer<ZodSchema<T>>;
      next: () => void;
    }) => Promise<void>
  > = [];

  public use(
    middleware: (opt: {
      user: User;
      parsedInput: z.infer<ZodSchema<T>>;
      next: () => void;
    }) => Promise<void>,
  ) {
    this._middlewares.push(middleware);
    return this;
  }

  public override schema<R>(schema: ZodSchema<R>) {
    this._schema = schema as any;

    return this as unknown as SafeQueryWithAuth<R>;
  }

  private async _runMiddlewares(
    user: User,
    parsedInput: z.infer<ZodSchema<T>>,
  ) {
    let nextIndex = 0;

    const next = async () => {
      const currentMiddleware = this._middlewares[nextIndex];

      nextIndex++;

      if (currentMiddleware) {
        await currentMiddleware({ user, parsedInput, next });
      }
    };

    await next();
  }

  public query<R>(
    query: (opt: {
      user: User;
      parsedInput: z.infer<ZodSchema<T>>;
    }) => Promise<R>,
  ) {
    return async (input?: z.infer<ZodSchema<T>>) => {
      const { user } = await getSession();

      const parsedInput = this._schema?.parse(input);

      await this._runMiddlewares(user, parsedInput);

      return query({ user, parsedInput });
    };
  }
}

class SafeQuery<T> extends QueryWithSchema<T> {
  public query<R>(
    query: (opt: { parsedInput: z.infer<ZodSchema<T>> }) => Promise<R>,
  ) {
    return async (input?: z.infer<ZodSchema<T>>) => {
      const parsedInput = this._schema.parse(input);

      return query({
        parsedInput,
      });
    };
  }
}

export const createSafeQuery = <T>() => new SafeQuery<T>();
export const createSafeQueryWithAuth = <T>() => new SafeQueryWithAuth<T>();

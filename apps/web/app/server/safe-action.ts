import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import { z } from "zod";

import { prisma } from "@repo/database";

import { authOptions } from "../api/auth/[...nextauth]/auth-options";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Error) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
}).use(async ({ next, clientInput, metadata }) => {
  if (process.env.NODE_ENV === "development") {
    console.log("LOGGING MIDDLEWARE");
  }

  // Here we await the action execution.
  const result = await next({ ctx: undefined });

  if (process.env.NODE_ENV === "development") {
    console.log("Result ->", result);
    console.log("Client input ->", clientInput);
    console.log("Metadata ->", metadata);
  }

  // And then return the result of the awaited action.
  return result;
});

export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
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

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { user } });
  });

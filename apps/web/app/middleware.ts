import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "next-auth/react";

import { prisma } from "@repo/database";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect("/api/auth/signin");
  }

  if (!session.user || !session.user.email) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

"use client";

import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";
import { IoProvider } from "socket.io-react-hook";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <IoProvider>{children}</IoProvider>
    </SessionProvider>
  );
}

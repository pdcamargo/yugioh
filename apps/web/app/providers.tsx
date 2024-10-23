"use client";

import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";
import { IoProvider } from "socket.io-react-hook";
import NiceModal from "@ebay/nice-modal-react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <IoProvider>
        <NiceModal.Provider>{children}</NiceModal.Provider>
      </IoProvider>
    </SessionProvider>
  );
}

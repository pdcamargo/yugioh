"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

// export const queueSocket = io() as Socket;

// TODO: Add support for multiple namespaces
export const useSocket = (namespace?: "match" | "queue") => {
  const socket = useRef<Socket | null>(null);

  if (!socket.current) {
    socket.current = io() as Socket;
  }

  const on = useCallback(
    <T = any>(event: string, callback: (data: T) => void) => {
      socket.current!.on(event, callback);

      return () => {
        socket.current!.off(event, callback);
      };
    },
    [],
  );

  const once = useCallback(
    <T = any>(event: string, callback: (data: T) => void) => {
      socket.current!.once(event, callback);

      return () => {
        socket.current!.off(event, callback);
      };
    },
    [],
  );

  const emit = useCallback(
    <T = any, A = any>(
      event: string,
      data: T,
      acknowledge?: (data: A) => void,
    ) => {
      socket.current!.emit(event, data, acknowledge);
    },
    [],
  );

  return { on, emit, once, socket: socket.current! };
};

export const useOnStartEmit = <T = any, A = any>(
  event: string,
  data: T,
  acknowledge?: (data: A) => void,
) => {
  const { emit } = useSocket();

  const acknowledgeRef = useRef(acknowledge);
  const dataRef = useRef(data);
  const eventRef = useRef(event);

  useEffect(() => {
    emit(eventRef.current, dataRef.current, acknowledgeRef.current);
  }, [emit]);
};

export const useOnEvent = <T = any>(
  event: string,
  callback: (data: T) => void,
) => {
  const { on } = useSocket();

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return on(event, callbackRef.current);
  }, [event, on]);
};

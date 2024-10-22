"use client";

import { useMemo, useState } from "react";

type MutationProps<T, R> = {
  onSuccess?: (data: R) => void;
  onError?: (error: Error) => void;
};

export const useMutation = <T extends any, R extends any>({
  mutation,
  onSuccess,
  onError,
}: {
  mutation: (data: T) => Promise<R>;
} & MutationProps<T, R>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<R | null>(null);

  const isError = useMemo(() => error !== null, [error]);

  const mutate = async (data: T, options?: MutationProps<T, R>) => {
    setLoading(true);

    try {
      const response = await mutation(data);
      setData(response);
      setError(null);

      onSuccess?.(response);
      options?.onSuccess?.(response);
    } catch (error) {
      setError(error as Error);

      onError?.(error as Error);
      options?.onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading: loading, error, data, mutate, isError };
};

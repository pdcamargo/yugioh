"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div
              className={cn("grid gap-1", {
                "w-full": variant === "screen",
              })}
            >
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

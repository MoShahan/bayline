import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border border-border bg-card text-card-foreground shadow-lg",
          title: "font-medium",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

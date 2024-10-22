import { Toaster } from "./components/ui/toaster";
import "./global.scss";
import ClientProviders from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="w-screen h-screen overflow-hidden bg-black">
        <ClientProviders>{children}</ClientProviders>

        <Toaster />
      </body>
    </html>
  );
}

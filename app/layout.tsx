import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Providers } from "@/components/providers/Providers";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Nthoppa - Financial Freedom for Everyone",
  description: "Empowering the unbanked through financial education and inclusive banking products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
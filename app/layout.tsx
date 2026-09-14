import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";

import "./globals.css";
import ConvexClientProvider from "@/components/provider/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Code Sight AI",
  description: "Code Sight AI - AI-Powered Code Review Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans hide-scrollbar">
        <ClerkProvider appearance={{ theme: dark }}>
          <ConvexClientProvider>
            <Toaster />
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
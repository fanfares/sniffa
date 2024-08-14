import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sniffa",
  description: "Peruse nostr data in a nice UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"app"}>{children}</body>
    </html>
  );
}

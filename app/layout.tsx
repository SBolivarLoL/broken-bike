import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geert's Broken Bike",
  description: "The official counter for Geert's bike misfortunes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

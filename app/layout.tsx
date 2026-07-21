import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hirth's Broken Bike",
  description: "The official counter for Hirth's bike misfortunes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Mortgage Underwriting Demo",
  description: "Small fullstack app with Go backend + Next frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}

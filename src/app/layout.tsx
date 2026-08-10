import type { Metadata } from "next";
import { Stack_Sans_Text } from "next/font/google";
import "./global.css";

const stackSans = Stack_Sans_Text({
  variable: "--stack-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vertex",
  description: "Keep track of your bouldering skills!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${stackSans.className}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

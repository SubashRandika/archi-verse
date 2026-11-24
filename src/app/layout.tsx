import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Archiverse",
    template: "%s · Archiverse",
  },
  description:
    "Learn software architecture and system design through interactive, guided 3D isometric visualizations.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0c10",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Dark-first product: the `dark` class is static, there is no light theme in the MVP.
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

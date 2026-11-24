import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";
import "./globals.css";

/*
 * Typography (ADR-0007): IBM Plex — an engineering-heritage family.
 * - Sans: interface and reading text.
 * - Condensed: drafting-style labels (title block, canvas labels).
 * - Mono: real protocol text only (HTTP lines, headers, JSON) — never decorative labels.
 */
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-plex-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
  themeColor: "#0c1420",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Dark-only product: the `dark` class is static (shadcn components key off it).
    <html
      lang="en"
      className={`dark ${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}

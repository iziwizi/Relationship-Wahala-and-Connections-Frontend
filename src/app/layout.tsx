import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.relationshipwahalaandconnections.com"),
  title: "Relationship Wahala & Connections | Nigeria's Premier Matchmaking Platform",
  description:
    "Nigeria's knowledge-based relationship and intentional matchmaking platform helping singles and couples build healthy, lasting relationships.",
  keywords: [
    "relationship matchmaking Nigeria",
    "intentional matchmaking",
    "pre-marital counseling",
    "EPMS",
    "marriage counseling Nigeria",
    "relationship education",
    "relationship wahala",
    "relationship wahala and connections",
  ],
  openGraph: {
    title: "Relationship Wahala & Connections",
    description:
      "Nigeria's premier knowledge-based relationship and matchmaking platform, helping intentional singles and couples build healthy, lasting relationships.",
    url: "https://www.relationshipwahalaandconnections.com",
    siteName: "Relationship Wahala & Connections",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relationship Wahala & Connections",
    description:
      "Nigeria's premier knowledge-based relationship and matchmaking platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

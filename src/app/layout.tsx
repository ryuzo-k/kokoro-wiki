import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Kokoro Wiki",
  description: "A minimalist wiki for thoughts and connections",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Kokoro Wiki",
    description: "Share your thoughts and connect with like-minded people",
    url: "https://kokoro-wiki.vercel.app",
    siteName: "Kokoro Wiki",
    images: [
      {
        url: "/ogp-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kokoro Wiki",
    description: "Share your thoughts and connect with like-minded people",
    images: ["/ogp-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono bg-background text-foreground leading-relaxed">
        <AuthProvider>
          {children}

        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "kokoro-wiki",
  description: "A minimalist wiki for thoughts and connections",
  openGraph: {
    title: "kokoro-wiki",
    description: "Share your thoughts and connect with like-minded people",
    url: "https://kokoro-wiki.vercel.app",
    siteName: "kokoro-wiki",
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
    title: "kokoro-wiki",
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
          <CommandPalette />
        </AuthProvider>
      </body>
    </html>
  );
}

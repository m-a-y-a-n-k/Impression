import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/styles/App.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Impression | Real-time Communication Coaching",
  description: "Improve your speaking skills with real-time AI analysis of your pace, sentiment, filler words, and body language.",
  keywords: ["communication coaching", "public speaking", "AI speech analysis", "impression improvement", "interview prep"],
  authors: [{ name: "Impression Team" }],
  openGraph: {
    title: "Impression | AI Communication Coach",
    description: "Master the art of conversation with real-time feedback.",
    url: "https://impression-app.com",
    siteName: "Impression",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impression | AI Communication Coach",
    description: "Master the art of conversation with real-time feedback.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { UserProvider } from "@/app/context/UserContext";
import { Footer } from "@/app/components/Footer";
import WarpcastBanner from "@/app/components/WarpcastBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const frame = {
  version: "next",
  imageUrl: "https://www.builderscore.xyz/images/frame-image.png",
  button: {
    title: "Mini App by @talent",
    action: {
      type: "launch_frame",
      name: "Mini App by @talent",
      url: "https://www.builderscore.xyz",
      splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
    },
  },
};

export const metadata: Metadata = {
  title: "Mini App by @talent",
  description: "A mini app by @talent",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Mini App by @talent",
    description: "A mini app by @talent",
    images: [
      {
        url: "https://www.builderscore.xyz/images/frame-image.png",
        alt: "Mini App by @talent",
      },
    ],
  },
  other: {
    "fc:frame": JSON.stringify(frame)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <UserProvider>
          <ThemeProvider>
            <WarpcastBanner />
            <div className="flex flex-col min-h-dvh max-w-3xl mx-auto py-4 px-4">
              <Navbar />
              <main className="flex flex-col h-full">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}

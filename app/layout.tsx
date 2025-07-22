import ScrollToTop from "@/components/common/ScrollToTop";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { Inter, Raleway, Roboto, Roboto_Flex } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./provider";

const TwitterPixel = dynamic(() => import("@/utils/twitterPixels"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "DevSpot – Welcome home, Builders",
  description:
    "Where Web3 devs go full send. Join hackathons, win prizes, and unleash your builder brain. Only on DevSpot.",
  applicationName: "DevSpot",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Web3",
    "AI",
    "hackathons",
    "developer platform",
    "blockchain",
    "builders",
  ],
  authors: [{ name: "DevSpot Team" }],
  creator: "DevSpot Team",
  publisher: "DevSpot",
  metadataBase: new URL("https://devspot.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DevSpot – Welcome home, Builders",
    description:
      "Where Web3 devs go full send. Join hackathons, win prizes, and unleash your builder brain. Only on DevSpot.",
    url: "https://devspot.app",
    siteName: "DevSpot",
    images: [
      {
        url: "/Logopreview.png",
        width: 1200,
        height: 630,
        alt: "DevSpot Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSpot – Welcome home, Builders",
    description:
      "Where Web3 devs go full send. Join hackathons, win prizes, and unleash your builder brain. Only on DevSpot.",
    site: "@devspot_app",
    creator: "@devspot_app",
    images: {
      url: "/Logopreview.png",
      alt: "DevSpot Logo",
      width: 1200,
      height: 630,
    },
  },
  icons: {
    // icon: [
    //   {
    //     media: "(prefers-color-scheme: light)",
    //     url: "/favicon-light.ico",
    //   },
    //   {
    //     media: "(prefers-color-scheme: dark)",
    //     url: "/favicon-dark.ico",
    //   },
    // ],
    icon: "/favicon.ico",
    shortcut: "/Favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/Favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/Favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  },
};

const raleway = Raleway({ subsets: ["latin"] });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const robotoFlex = Roboto_Flex({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-flex",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DevSpot",
              url: "https://devspot.app",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://devspot.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${raleway.className} ${inter.variable} ${roboto.variable} ${robotoFlex.variable} dark:bg-blackest-500`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ScrollToTop>{children}</ScrollToTop>
          </Providers>
          <Toaster position="bottom-right" />
          <TwitterPixel />
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-SCY5ZK9R1G" />
      )}
    </html>
  );
}

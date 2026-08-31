import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/auth/app-providers";
import { CookieConsent } from "@/components/seo/cookie-consent";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import {
  ADSENSE_CLIENT_ID,
  GOOGLE_SITE_VERIFICATION,
  PARENT_COMPANY_NAME,
  PARENT_COMPANY_URL,
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_BRAND} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_BRAND}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_BRAND,
  keywords: SITE_KEYWORDS,
  category: "education",
  authors: [
    { name: PARENT_COMPANY_NAME, url: PARENT_COMPANY_URL },
    { name: SITE_NAME, url: SITE_URL },
  ],
  creator: PARENT_COMPANY_NAME,
  publisher: PARENT_COMPANY_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_BRAND,
    locale: "en_IN",
    url: SITE_URL,
    title: `${SITE_BRAND} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_BRAND} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  ...(ADSENSE_CLIENT_ID
    ? { other: { "google-adsense-account": ADSENSE_CLIENT_ID } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} scroll-smooth`}>
      <head>
        {process.env.NODE_ENV === "production" && ADSENSE_CLIENT_ID ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen overflow-x-clip bg-cream font-sans text-ink antialiased">
        <AppProviders>{children}</AppProviders>
        <CookieConsent />
      </body>
    </html>
  );
}

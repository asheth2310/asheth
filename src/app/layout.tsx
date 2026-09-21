import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060809" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f8" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Aagam Sheth // AI Systems Engineer",
    template: "%s // Aagam Sheth",
  },
  description:
    "Portfolio of Aagam Sheth — Software & AI Systems Engineer building agentic AI systems, data platforms, and the infrastructure they run on.",
  keywords: [
    "Aagam Sheth",
    "Software Engineer",
    "AI Systems Engineer",
    "Agentic AI",
    "LLM Systems",
    "AI Observability",
    "Portfolio",
    "Next.js",
    "Python",
    "Machine Learning",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: {
    canonical: SITE.url,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: `${SITE.name} // AI Systems Engineer`,
    title: "Aagam Sheth // AI Systems Engineer",
    description:
      "Building systems that think & scale — agentic AI, data platforms, and production infrastructure.",
    // TODO: add a 1200x630 OG image at public/og-image.png and uncomment:
    // images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Aagam Sheth — Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aagam Sheth // AI Systems Engineer",
    description:
      "Building systems that think & scale — agentic AI, data platforms, and production infrastructure.",
    // images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: SITE.role,
  sameAs: [SITE.github, SITE.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

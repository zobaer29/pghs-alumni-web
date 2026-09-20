import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Pirojpur Govt. High School Alumni Association",
  alternateName: ["PGHS Alumni Association", "Pirojpur Govt High School Alumni Network"],
  url: siteUrl,
  logo: `${siteUrl}/img/logo.png`,
  image: `${siteUrl}/img/school.webp`,
  description:
    "The official alumni community and networking platform for Pirojpur Govt. High School students and graduates.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pirojpur",
    addressCountry: "BD",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pirojpur Govt. High School Alumni Association",
    template: "%s | PGHS Alumni Network",
  },
  description:
    "Connect with verified alumni of Pirojpur Govt. High School, discover school events, share community updates, and grow your professional network.",
  keywords: [
    "Pirojpur",
    "PGHS",
    "Pirojpur Govt. High School",
    "Pirojpur Govt High School alumni",
    "Pirojpur Govt High School official alumni association",
    "PGHS alumni association",
    "Pirojpur alumni network",
    "Bangladesh school alumni",
    "alumni directory",
    "school reunions",
    "alumni community",
    "alumni events",
    "alumni news",
    "alumni stories",
  ],
  authors: [{ name: "Pirojpur Govt. High School Alumni Association" }],
  creator: "Pirojpur Govt. High School Alumni Association | Md Zobaer Islam ,Batch of 2019, PGHS,https://zobaer.dev",
  alternates: {
    canonical: "/",
  },
  applicationName: "PGHS Alumni Network",
  icons: {
    icon: [
      {
        url: "/img/logo.png",
        type: "image/png",
      },
    ],
    apple: "/img/logo.png",
    shortcut: "/img/logo.png",
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
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "/",
    siteName: "PGHS Alumni Network",
    title: "Pirojpur Govt. High School Alumni Association",
    description:
      "A verified community network for students and alumni of Pirojpur Govt. High School.",
    images: [
      {
        url: "/img/school.webp",
        width: 1200,
        height: 630,
        alt: "Pirojpur Govt. High School campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pirojpur Govt. High School Alumni Association",
    description:
      "Connect with verified alumni, discover events, and share school community updates.",
    images: ["/img/school.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${jakarta.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full bg-transparent text-slate-100 font-sans selection:bg-emerald-500 selection:text-white flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}

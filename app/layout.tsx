import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { Navigation } from "./components/nav";
import { SiteEntrance } from "./components/site-loader";
import { introduction } from "./profile";

export const metadata: Metadata = {
  title: {
    default: "Kushagra Pandey",
    template: "%s | kushagrapandey.com",
  },
  description: introduction,
  openGraph: {
    title: "Kushagra Pandey",
    description: introduction,
    url: "https://kushagrapandey.com",
    siteName: "Kushagra Pandey",
    images: [
      {
        url: "https://kushagrapandey.com/me.jpg",
        width: 1365,
        height: 2048,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" data-scroll-behavior="smooth" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        {/* Set before paint so returning visitors never flash the intro. */}
        <script id="intro-preference" dangerouslySetInnerHTML={{ __html: `(()=>{const eligible=location.pathname==="/"&&!location.hash&&scrollY<=1&&!matchMedia("(prefers-reduced-motion: reduce)").matches;let seen=false;try{seen=!!sessionStorage.getItem("kp-intro-seen")}catch{}document.documentElement.dataset.intro=eligible&&!seen?"pending":"done";setTimeout(()=>{if(document.documentElement.dataset.intro==="pending")document.documentElement.dataset.intro="done"},10000)})()` }} />
        <Analytics />
      </head>
      <body>
        <noscript><style>{`.intro-loader { display: none !important; } .hero-name, .site-nav { visibility: visible !important; } .hero-introduction, .site-nav { opacity: 1 !important; } .route-transition, .reveal, .scroll-art, .entrance-element, .entrance-word, .entrance-frame { opacity: 1 !important; transform: none !important; clip-path: none !important; }`}</style></noscript>
        <SiteEntrance>
          <Navigation />
          {children}
        </SiteEntrance>
      </body>
    </html>
  );
}

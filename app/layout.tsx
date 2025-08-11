import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SkipLink from "@/components/skip-link"

export const metadata: Metadata = {
  title: "MuséesFR - Découvrez les Musées de France",
  description:
    "Explorez, partagez et découvrez les trésors culturels français. Votre guide pour les musées, expositions et événements culturels en France.",
  keywords: "musées, France, culture, expositions, art, histoire, patrimoine",
  authors: [{ name: "MuséesFR" }],
  openGraph: {
    title: "MuséesFR - Découvrez les Musées de France",
    description: "Explorez, partagez et découvrez les trésors culturels français",
    type: "website",
    locale: "fr_FR",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
      </head>
      <body className="">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SkipLink />
          <div id="main-content">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}

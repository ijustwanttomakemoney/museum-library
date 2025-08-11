"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ArtworkGallery from "@/components/artwork-gallery"

export default function ArtworksPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-12" id="main-content">
        <ArtworkGallery />
      </main>

      <Footer />
    </div>
  )
}

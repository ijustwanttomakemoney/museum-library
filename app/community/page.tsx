"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import CommunityForum from "@/components/community-forum"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-12" id="main-content">
        <CommunityForum />
      </main>

      <Footer />
    </div>
  )
}

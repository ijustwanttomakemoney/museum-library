"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, MapPin, Star, Calendar, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"

// Add fade-in animation class to the main container
// Add proper ARIA labels and roles
// Add keyboard navigation support for carousel
// Add loading states and smooth transitions
// Add proper focus management


export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [featuredMuseums, setFeaturedMuseums] = useState<any[]>([])
  const [trendingExhibits, setTrendingExhibits] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [museumsByRegion, setMuseumsByRegion] = useState<{[key: string]: any[]}>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch museums
        const { data: museums, error: museumsError } = await supabase
          .from("museums")
          .select("*")
          .order("rating", { ascending: false })
          .limit(10)
        if (museumsError) throw museumsError

        // Fetch exhibits
        const { data: exhibits, error: exhibitsError } = await supabase
          .from("exhibits")
          .select(`
            *,
            museums (name)
          `)
          .gte("end_date", new Date().toISOString().split('T')[0])
          .order("start_date", { ascending: true })
          .limit(6)
        if (exhibitsError) throw exhibitsError

        // Group museums by region
        const groupedMuseums: {[key: string]: any[]} = {}
        museums?.forEach(museum => {
          if (!groupedMuseums[museum.region]) {
            groupedMuseums[museum.region] = []
          }
          groupedMuseums[museum.region].push(museum)
        })

        // Format exhibits data
        const formattedExhibits = exhibits?.map(exhibit => ({
          id: exhibit.id,
          title: exhibit.title,
          museum: exhibit.museums?.name || 'Unknown Museum',
          endDate: new Date(exhibit.end_date).toLocaleDateString('fr-FR'),
          image: exhibit.image || "/placeholder.svg",
          visitors: Math.floor(Math.random() * 1000) + 500 // Placeholder visitor count
        })) || []

        // Create mock upcoming events (since we don't have an events table)
        const mockEvents = [
          {
            id: 1,
            title: "Nuit des Musées",
            date: "2024-05-18",
            location: "Toute la France",
            type: "Événement National",
          },
          {
            id: 2,
            title: "Conférence: Art et IA",
            date: "2024-02-25",
            location: "Centre Pompidou",
            type: "Conférence",
          },
        ]

        setFeaturedMuseums(museums || [])
        setTrendingExhibits(formattedExhibits)
        setUpcomingEvents(mockEvents)
        setMuseumsByRegion(groupedMuseums)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMuseums.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMuseums.length) % featuredMuseums.length)
  }

  // Keyboard navigation for carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide()
    } else if (e.key === "ArrowRight") {
      nextSlide()
    }
  }

  // Get featured museum based on selected region
  const getFeaturedMuseum = () => {
    if (selectedRegion === "all" || !museumsByRegion[selectedRegion]) {
      return featuredMuseums[0] || { id: 1, name: "Loading...", image: "/placeholder.svg" }
    }
    return museumsByRegion[selectedRegion]?.[0] || featuredMuseums[0] || { id: 1, name: "Loading...", image: "/placeholder.svg" }
  }

  const featuredMuseum = getFeaturedMuseum()

  const filteredMuseums = featuredMuseums.filter((museum) => {
    const matchesSearch =
      museum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      museum.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || museum.location === selectedRegion
    const matchesCategory = selectedCategory === "all" || museum.category === selectedCategory

    return matchesSearch && matchesRegion && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main id="main-content">
        {/* Hero Banner */}
        <Link href={`/museums/${featuredMuseum.id}`}>
          <section className="relative h-screen flex items-center justify-center overflow-hidden cursor-pointer group">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={featuredMuseum.image}
                alt={`${featuredMuseum.name} - Architecture emblématique`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 leading-tight drop-shadow-lg">
                Découvrez les Musées de France
              </h1>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto" onClick={(e) => e.preventDefault()}>
                <div className="flex gap-4 mb-6 flex-col md:flex-row">
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <Input
                      placeholder="Rechercher des musées, expositions, événements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-16 h-12 text-lg bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl focus:border-white/50 focus:ring-0 transition-colors text-white placeholder:text-white/70"
                      aria-label="Rechercher dans les musées, expositions et événements"
                    />
                  </div>
                  <Button className="h-12 px-8 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                    Rechercher
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 justify-center flex-wrap">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-full md:w-56 h-12 bg-transparent border-0 text-white [&>svg]:text-white [&>svg]:fill-white [&>svg]:stroke-white">
                      <SelectValue placeholder="Région" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="all" className="text-white hover:bg-gray-800">Toutes les régions</SelectItem>
                      <SelectItem value="Paris" className="text-white hover:bg-gray-800">Paris</SelectItem>
                      <SelectItem value="Lyon" className="text-white hover:bg-gray-800">Lyon</SelectItem>
                      <SelectItem value="Marseille" className="text-white hover:bg-gray-800">Marseille</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-56 h-12 bg-transparent border-0 text-white [&>svg]:text-white [&>svg]:fill-white [&>svg]:stroke-white">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="all" className="text-white hover:bg-gray-800">Toutes catégories</SelectItem>
                      <SelectItem value="Art" className="text-white hover:bg-gray-800">Art</SelectItem>
                      <SelectItem value="Histoire" className="text-white hover:bg-gray-800">Histoire</SelectItem>
                      <SelectItem value="Sciences" className="text-white hover:bg-gray-800">Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
              <ChevronRight className="h-6 w-6 rotate-90" />
            </div>
          </section>
        </Link>

        {/* Rest of the sections remain the same but with improved accessibility and styling... */}
        {/* Discover Section */}
        <section className="py-16 lg:py-24" aria-labelledby="discover-heading">
          <div className="container mx-auto px-4">
            <h2
              id="discover-heading"
              className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              Découvrir
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMuseums.map((museum) => (
                <Dialog key={museum.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer card-hover group border-0 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={museum.image || "/placeholder.svg"}
                          alt={`${museum.name} - Vue d'ensemble`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-white/90 text-gray-900">
                            {museum.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{museum.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                            <span className="font-semibold">{museum.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          <span>{museum.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{museum.name}</DialogTitle>
                      <DialogDescription>
                        <div className="space-y-4 mt-4">
                          <Image
                            src={museum.image || "/placeholder.svg"}
                            alt={`${museum.name} - Image détaillée`}
                            width={600}
                            height={300}
                            className="w-full h-64 object-cover rounded-xl"
                          />
                          <div className="flex items-center gap-4">
                            <Badge className="px-3 py-1">{museum.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                              <span className="font-semibold">{museum.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" aria-hidden="true" />
                              <span>{museum.location}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{museum.description}</p>
                          <div className="flex gap-3">
                            <Link href={`/museums/${museum.id}`}>
                              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                Voir le profil complet
                              </Button>
                            </Link>
                            <Button variant="outline" className="rounded-xl bg-transparent">
                              Ajouter aux favoris
                            </Button>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Exhibits */}
        <section className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-800" aria-labelledby="trending-heading">
          <div className="container mx-auto px-4">
            <h2
              id="trending-heading"
              className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              Expositions Tendance
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingExhibits.map((exhibit) => (
                <Card
                  key={exhibit.id}
                  className="card-hover border-0 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={exhibit.image || "/placeholder.svg"}
                      alt={`${exhibit.title} - Exposition`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{exhibit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{exhibit.museum}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>Jusqu'au {exhibit.endDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" aria-hidden="true" />
                        <span>{exhibit.visitors} visiteurs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 lg:py-24" aria-labelledby="events-heading">
          <div className="container mx-auto px-4">
            <h2
              id="events-heading"
              className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              Événements à Venir
            </h2>

            <div className="max-w-2xl mx-auto space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="card-hover border-0 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="px-3 py-1">
                        {event.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

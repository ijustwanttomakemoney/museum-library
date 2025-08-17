"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Star, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"

interface Museum {
  id: number;
  name: string;
  location: string;
  region: string;
  category: string;
  image: string;
  rating: number;
  openingHours: string;
  description: string;
  visitors: string;
}

export default function MuseumsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [museums, setMuseums] = useState<Museum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const { data, error } = await supabase.from("museums").select("*")
        if (error) throw error
        setMuseums(data as Museum[])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMuseums()
  }, [])

  const filteredMuseums = museums
    .filter((museum) => {
      const matchesSearch =
        museum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        museum.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRegion = selectedRegion === "all" || museum.region === selectedRegion
      const matchesCategory = selectedCategory === "all" || museum.category === selectedCategory

      return matchesSearch && matchesRegion && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "location") return a.location.localeCompare(b.location)
      return 0
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading museums...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">Musées de France</h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            Découvrez les plus beaux musées français et leurs collections exceptionnelles
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un musée..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  <SelectItem value="Île-de-France">Île-de-France</SelectItem>
                  <SelectItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</SelectItem>
                  <SelectItem value="Provence-Alpes-Côte d'Azur">PACA</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Histoire">Histoire</SelectItem>
                  <SelectItem value="Sciences">Sciences</SelectItem>
                  <SelectItem value="Impressionnisme">Impressionnisme</SelectItem>
                  <SelectItem value="Art Moderne">Art Moderne</SelectItem>
                  <SelectItem value="Sculpture">Sculpture</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="location">Localisation</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                {filteredMuseums.length} musée{filteredMuseums.length > 1 ? "s" : ""} trouvé
                {filteredMuseums.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Museums Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMuseums.map((museum) => (
              <Card key={museum.id} className="hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={museum.image || "/placeholder.svg"}
                    alt={museum.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{museum.category}</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{museum.rating}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2">{museum.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{museum.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{museum.openingHours}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{museum.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{museum.visitors}</span>
                    <Link href={`/museums/${museum.id}`}>
                      <Button size="sm">Découvrir</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMuseums.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun musée trouvé pour ces critères.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedRegion("all")
                  setSelectedCategory("all")
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

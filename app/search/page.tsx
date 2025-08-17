"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, Star, Filter, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [searchResults, setSearchResults] = useState<{
    museums: any[];
    exhibits: any[];
    events: any[];
  }>({
    museums: [],
    exhibits: [],
    events: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load initial data
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      
      // Fetch museums
      const { data: museums, error: museumsError } = await supabase
        .from("museums")
        .select("*")
        .limit(6)
      if (museumsError) throw museumsError

      // Fetch exhibits
      const { data: exhibits, error: exhibitsError } = await supabase
        .from("exhibits")
        .select(`
          *,
          museums (name, location)
        `)
        .limit(6)
      if (exhibitsError) throw exhibitsError

      // Format exhibits data
      const formattedExhibits = exhibits?.map(exhibit => ({
        ...exhibit,
        museum: exhibit.museums?.name || 'Unknown Museum',
        location: exhibit.museums?.location || 'Unknown Location',
        endDate: new Date(exhibit.end_date).toLocaleDateString('fr-FR'),
        visitors: Math.floor(Math.random() * 2000) + 100
      })) || []

      // Mock events data
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

      setSearchResults({
        museums: museums || [],
        exhibits: formattedExhibits,
        events: mockEvents
      })
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchInitialData()
      return
    }

    try {
      setLoading(true)
      
      // Search museums
      const { data: museums, error: museumsError } = await supabase
        .from("museums")
        .select("*")
        .or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10)
      if (museumsError) throw museumsError

      // Search exhibits
      const { data: exhibits, error: exhibitsError } = await supabase
        .from("exhibits")
        .select(`
          *,
          museums (name, location)
        `)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10)
      if (exhibitsError) throw exhibitsError

      // Format exhibits data
      const formattedExhibits = exhibits?.map(exhibit => ({
        ...exhibit,
        museum: exhibit.museums?.name || 'Unknown Museum',
        location: exhibit.museums?.location || 'Unknown Location',
        endDate: new Date(exhibit.end_date).toLocaleDateString('fr-FR'),
        visitors: Math.floor(Math.random() * 2000) + 100
      })) || []

      // Filter events based on search query
      const filteredEvents = searchResults.events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setSearchResults({
        museums: museums || [],
        exhibits: formattedExhibits,
        events: filteredEvents
      })
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Header */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-center mb-8">Recherche</h1>

            {/* Main Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher des musées, expositions, événements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button size="lg" onClick={handleSearch}>
                Rechercher
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="lyon">Lyon</SelectItem>
                  <SelectItem value="marseille">Marseille</SelectItem>
                  <SelectItem value="toulouse">Toulouse</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="histoire">Histoire</SelectItem>
                  <SelectItem value="sciences">Sciences</SelectItem>
                  <SelectItem value="archeologie">Archéologie</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Pertinence</SelectItem>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="popularity">Popularité</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Plus de filtres
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="museums">Musées</TabsTrigger>
                <TabsTrigger value="exhibits">Expositions</TabsTrigger>
                <TabsTrigger value="events">Événements</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-12">
                  {/* Museums Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-serif font-bold">Musées</h2>
                      <Link href="/museums" className="text-blue-600 hover:underline">
                        Voir tous les musées
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.museums.map((museum) => (
                        <Card key={museum.id} className="hover:shadow-lg transition-shadow duration-300">
                          <div className="relative h-48">
                            <Image
                              src={museum.image || "/placeholder.svg"}
                              alt={museum.name}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge variant="secondary">{museum.category}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{museum.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{museum.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{museum.openingHours}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{museum.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Exhibits Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-serif font-bold">Expositions</h2>
                      <Link href="/exhibits" className="text-blue-600 hover:underline">
                        Voir toutes les expositions
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.exhibits.map((exhibit) => (
                        <Card key={exhibit.id} className="hover:shadow-lg transition-shadow duration-300">
                          <div className="relative h-48">
                            <Image
                              src={exhibit.image || "/placeholder.svg"}
                              alt={exhibit.title}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{exhibit.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {exhibit.museum}, {exhibit.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Jusqu'au {exhibit.endDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{exhibit.visitors} visiteurs</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Events Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-serif font-bold">Événements</h2>
                      <Link href="/events" className="text-blue-600 hover:underline">
                        Voir tous les événements
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {searchResults.events.map((event) => (
                        <Card key={event.id} className="hover:shadow-md transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="museums">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.museums.map((museum) => (
                    <Card key={museum.id} className="hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48">
                        <Image
                          src={museum.image || "/placeholder.svg"}
                          alt={museum.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary">{museum.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{museum.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{museum.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{museum.openingHours}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{museum.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="exhibits">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.exhibits.map((exhibit) => (
                    <Card key={exhibit.id} className="hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48">
                        <Image
                          src={exhibit.image || "/placeholder.svg"}
                          alt={exhibit.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{exhibit.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {exhibit.museum}, {exhibit.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Jusqu'au {exhibit.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{exhibit.visitors} visiteurs</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="space-y-4">
                  {searchResults.events.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

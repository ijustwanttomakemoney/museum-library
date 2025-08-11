"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"

const exhibits = [
  {
    id: 1,
    title: "Monet et les Nymphéas",
    museum: "Musée de l'Orangerie",
    location: "Paris",
    category: "Impressionnisme",
    image: "/placeholder.svg?height=250&width=400",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    status: "En cours",
    visitors: 1250,
    description: "Une immersion totale dans l'univers des Nymphéas de Claude Monet.",
    price: "14€",
  },
  {
    id: 2,
    title: "Égypte Ancienne: Trésors des Pharaons",
    museum: "Musée du Louvre",
    location: "Paris",
    category: "Archéologie",
    image: "/placeholder.svg?height=250&width=400",
    startDate: "2024-02-01",
    endDate: "2024-04-20",
    status: "En cours",
    visitors: 980,
    description: "Découvrez les trésors exceptionnels de l'Égypte ancienne.",
    price: "16€",
  },
  {
    id: 3,
    title: "Picasso: Période Bleue",
    museum: "Musée Picasso",
    location: "Paris",
    category: "Art Moderne",
    image: "/placeholder.svg?height=250&width=400",
    startDate: "2024-01-10",
    endDate: "2024-02-28",
    status: "Se termine bientôt",
    visitors: 750,
    description: "Les œuvres emblématiques de la période bleue de Picasso.",
    price: "12€",
  },
  {
    id: 4,
    title: "Van Gogh: Les Dernières Années",
    museum: "Musée d'Orsay",
    location: "Paris",
    category: "Post-Impressionnisme",
    image: "/placeholder.svg?height=250&width=400",
    startDate: "2024-03-01",
    endDate: "2024-06-15",
    status: "À venir",
    visitors: 0,
    description: "Les œuvres poignantes des dernières années de Van Gogh.",
    price: "15€",
  },
  {
    id: 5,
    title: "Dinosaures: Géants du Passé",
    museum: "Muséum d'Histoire Naturelle",
    location: "Paris",
    category: "Sciences",
    image: "/placeholder.svg?height=250&width=400",
    startDate: "2024-01-20",
    endDate: "2024-05-30",
    status: "En cours",
    visitors: 2100,
    description: "Une exposition spectaculaire sur les dinosaures et leur époque.",
    price: "13€",
  },
  {
    id: 6,
    title: "Renaissance Italienne",
    museum: "Musée des Beaux-Arts",
    location: "Lyon",
    category: "Renaissance",
    image: "/placeholder.svg?height=250&width=400",
    startDate: "2024-02-15",
    endDate: "2024-07-10",
    status: "En cours",
    visitors: 420,
    description: "Chefs-d'œuvre de la Renaissance italienne.",
    price: "11€",
  },
]

export default function ExhibitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("endDate")

  const filteredExhibits = exhibits
    .filter((exhibit) => {
      const matchesSearch =
        exhibit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exhibit.museum.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || exhibit.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || exhibit.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "endDate") return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      if (sortBy === "visitors") return b.visitors - a.visitors
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-green-100 text-green-800"
      case "À venir":
        return "bg-blue-100 text-blue-800"
      case "Se termine bientôt":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-center mb-4">Expositions</h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            Découvrez les expositions temporaires et permanentes des musées français
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
                  placeholder="Rechercher une exposition..."
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="Impressionnisme">Impressionnisme</SelectItem>
                  <SelectItem value="Art Moderne">Art Moderne</SelectItem>
                  <SelectItem value="Archéologie">Archéologie</SelectItem>
                  <SelectItem value="Sciences">Sciences</SelectItem>
                  <SelectItem value="Renaissance">Renaissance</SelectItem>
                  <SelectItem value="Post-Impressionnisme">Post-Impressionnisme</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="À venir">À venir</SelectItem>
                  <SelectItem value="Se termine bientôt">Se termine bientôt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endDate">Date de fin</SelectItem>
                  <SelectItem value="visitors">Popularité</SelectItem>
                  <SelectItem value="title">Titre</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                {filteredExhibits.length} exposition{filteredExhibits.length > 1 ? "s" : ""} trouvée
                {filteredExhibits.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibits Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExhibits.map((exhibit) => (
              <Card key={exhibit.id} className="hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={exhibit.image || "/placeholder.svg"}
                    alt={exhibit.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(exhibit.status)}>{exhibit.status}</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{exhibit.category}</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2 line-clamp-2">{exhibit.title}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {exhibit.museum}, {exhibit.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Jusqu'au {formatDate(exhibit.endDate)}</span>
                    </div>
                    {exhibit.visitors > 0 && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{exhibit.visitors.toLocaleString()} visiteurs</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{exhibit.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-600">{exhibit.price}</span>
                    <Link href={`/exhibits/${exhibit.id}`}>
                      <Button size="sm">Découvrir</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExhibits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune exposition trouvée pour ces critères.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedStatus("all")
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

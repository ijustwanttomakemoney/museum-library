"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Calendar, Palette, User, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import StarRating from "./star-rating"

interface Artwork {
  id: number
  title: string
  artist: string
  year: number
  medium: string
  dimensions: string
  description: string
  image: string
  style: string
  rating: number
  isFavorite: boolean
  museum: string
}

interface Artist {
  id: number
  name: string
  birthYear: number
  deathYear?: number
  nationality: string
  biography: string
  style: string
  famousWorks: string[]
  image: string
  artworksCount: number
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "La Joconde",
    artist: "Léonard de Vinci",
    year: 1503,
    medium: "Huile sur peuplier",
    dimensions: "77 × 53 cm",
    description:
      "Portrait de Lisa Gherardini, épouse de Francesco del Giocondo, la Joconde est l'œuvre la plus célèbre au monde.",
    image: "/placeholder.svg?height=400&width=300",
    style: "Renaissance",
    rating: 4.9,
    isFavorite: false,
    museum: "Musée du Louvre",
  },
  {
    id: 2,
    title: "La Liberté guidant le peuple",
    artist: "Eugène Delacroix",
    year: 1830,
    medium: "Huile sur toile",
    dimensions: "260 × 325 cm",
    description: "Œuvre emblématique de la révolution française et symbole de liberté.",
    image: "/placeholder.svg?height=400&width=300",
    style: "Romantisme",
    rating: 4.8,
    isFavorite: true,
    museum: "Musée du Louvre",
  },
  {
    id: 3,
    title: "Les Nymphéas",
    artist: "Claude Monet",
    year: 1919,
    medium: "Huile sur toile",
    dimensions: "200 × 425 cm",
    description: "Série de peintures impressionnistes représentant le jardin de Giverny.",
    image: "/placeholder.svg?height=400&width=300",
    style: "Impressionnisme",
    rating: 4.7,
    isFavorite: false,
    museum: "Musée de l'Orangerie",
  },
]

const artists: Artist[] = [
  {
    id: 1,
    name: "Léonard de Vinci",
    birthYear: 1452,
    deathYear: 1519,
    nationality: "Italien",
    biography:
      "Léonard de Vinci était un polymathe de la Renaissance italienne, actif en tant que peintre, dessinateur, ingénieur, scientifique, théoricien, sculpteur et architecte.",
    style: "Renaissance",
    famousWorks: ["La Joconde", "La Cène", "L'Homme de Vitruve"],
    image: "/placeholder.svg?height=200&width=200",
    artworksCount: 15,
  },
  {
    id: 2,
    name: "Claude Monet",
    birthYear: 1840,
    deathYear: 1926,
    nationality: "Français",
    biography:
      "Claude Monet était un peintre français et l'un des fondateurs de l'impressionnisme. Il est particulièrement célèbre pour ses paysages peints en plein air.",
    style: "Impressionnisme",
    famousWorks: ["Les Nymphéas", "Impression, soleil levant", "La Cathédrale de Rouen"],
    image: "/placeholder.svg?height=200&width=200",
    artworksCount: 42,
  },
]

export default function ArtworkGallery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [selectedArtist, setSelectedArtist] = useState("all")
  const [activeTab, setActiveTab] = useState<"artworks" | "artists">("artworks")
  const [favorites, setFavorites] = useState<number[]>([2])

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch =
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStyle = selectedStyle === "all" || artwork.style === selectedStyle
    const matchesArtist = selectedArtist === "all" || artwork.artist === selectedArtist

    return matchesSearch && matchesStyle && matchesArtist
  })

  const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleFavorite = (artworkId: number) => {
    setFavorites((prev) => (prev.includes(artworkId) ? prev.filter((id) => id !== artworkId) : [...prev, artworkId]))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Galerie d'Art</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explorez notre collection d'œuvres d'art et découvrez les artistes qui ont marqué l'histoire
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" aria-hidden="true" />
            <Input
              placeholder="Rechercher une œuvre ou un artiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-0"
              aria-label="Rechercher dans les œuvres d'art et les artistes"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "artworks" ? "default" : "outline"}
            onClick={() => setActiveTab("artworks")}
            className="rounded-xl"
          >
            <Palette className="w-4 h-4 mr-2" />
            Œuvres d'art ({filteredArtworks.length})
          </Button>
          <Button
            variant={activeTab === "artists" ? "default" : "outline"}
            onClick={() => setActiveTab("artists")}
            className="rounded-xl"
          >
            <User className="w-4 h-4 mr-2" />
            Artistes ({filteredArtists.length})
          </Button>
        </div>

        {/* Additional Filters for Artworks */}
        {activeTab === "artworks" && (
          <div className="flex gap-4">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white dark:bg-gray-800"
              aria-label="Filtrer par style artistique"
            >
              <option value="all">Tous les styles</option>
              <option value="Renaissance">Renaissance</option>
              <option value="Impressionnisme">Impressionnisme</option>
              <option value="Romantisme">Romantisme</option>
            </select>

            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white dark:bg-gray-800"
              aria-label="Filtrer par artiste"
            >
              <option value="all">Tous les artistes</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.name}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === "artworks" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork) => (
            <Dialog key={artwork.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer card-hover border-0 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={artwork.image || "/placeholder.svg"}
                      alt={`${artwork.title} par ${artwork.artist}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        {artwork.style}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(artwork.id)
                        }}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={
                          favorites.includes(artwork.id)
                            ? `Retirer ${artwork.title} des favoris`
                            : `Ajouter ${artwork.title} aux favoris`
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(artwork.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{artwork.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">par {artwork.artist}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{artwork.year}</span>
                      </div>
                      <StarRating rating={artwork.rating} size="sm" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{artwork.title}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-96">
                    <Image
                      src={artwork.image || "/placeholder.svg"}
                      alt={`${artwork.title} par ${artwork.artist}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Détails de l'œuvre</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Artiste:</span>
                          <span>{artwork.artist}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Année:</span>
                          <span>{artwork.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Technique:</span>
                          <span>{artwork.medium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Dimensions:</span>
                          <span>{artwork.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Style:</span>
                          <span>{artwork.style}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Musée:</span>
                          <span>{artwork.museum}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{artwork.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={artwork.rating} showLabel />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => toggleFavorite(artwork.id)}
                        variant={favorites.includes(artwork.id) ? "default" : "outline"}
                        className="rounded-xl"
                      >
                        <Heart className={`w-4 h-4 mr-2 ${favorites.includes(artwork.id) ? "fill-current" : ""}`} />
                        {favorites.includes(artwork.id) ? "Retiré des favoris" : "Ajouter aux favoris"}
                      </Button>
                      <Button variant="outline" className="rounded-xl bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtists.map((artist) => (
            <Dialog key={artist.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer card-hover border-0 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={`Portrait de ${artist.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{artist.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Période:</span>
                        <span>
                          {artist.birthYear} - {artist.deathYear || "présent"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nationalité:</span>
                        <span>{artist.nationality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Style:</span>
                        <span>{artist.style}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Œuvres:</span>
                        <span>{artist.artworksCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{artist.name}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={`Portrait de ${artist.name}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Biographie</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{artist.biography}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Œuvres célèbres</h3>
                      <ul className="space-y-1">
                        {artist.famousWorks.map((work, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{work}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* No Results */}
      {((activeTab === "artworks" && filteredArtworks.length === 0) ||
        (activeTab === "artists" && filteredArtists.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setSelectedStyle("all")
              setSelectedArtist("all")
            }}
            variant="outline"
            className="rounded-xl"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}

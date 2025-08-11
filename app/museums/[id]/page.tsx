"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Phone, Globe, Star, Calendar, Camera, Share2, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EnhancedReviewSystem from "@/components/enhanced-review-system"
import FollowButton from "@/components/follow-button"

// Mock data for museum details
const museumData = {
  id: 1,
  name: "Musée du Louvre",
  location: "Paris, France",
  address: "Rue de Rivoli, 75001 Paris",
  phone: "+33 1 40 20 50 50",
  website: "https://www.louvre.fr",
  category: "Art",
  rating: 4.8,
  totalReviews: 15420,
  openingHours: {
    Lundi: "Fermé",
    Mardi: "9h00 - 18h00",
    Mercredi: "9h00 - 21h45",
    Jeudi: "9h00 - 18h00",
    Vendredi: "9h00 - 21h45",
    Samedi: "9h00 - 18h00",
    Dimanche: "9h00 - 18h00",
  },
  description:
    "Le Musée du Louvre est le plus grand musée d'art du monde et un monument historique situé à Paris. Avec plus de 35 000 œuvres exposées sur 60 600 m², le Louvre est le musée le plus visité au monde.",
  history:
    "Ancienne résidence royale, le Louvre est devenu un musée public en 1793. Il abrite des collections d'art occidental du Moyen Âge à 1848, ainsi que des civilisations antiques orientales, égyptiennes, grecques, étrusques et romaines.",
  highlights: [
    "La Joconde de Léonard de Vinci",
    "La Vénus de Milo",
    "La Liberté guidant le peuple de Delacroix",
    "Les Noces de Cana de Véronèse",
  ],
  currentExhibits: [
    {
      id: 1,
      title: "Léonard de Vinci",
      endDate: "2024-02-24",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Art Islamique",
      endDate: "2024-06-15",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  images: [
    "/louvre.jpg",
    "/placeholder.svg?height=400&width=600&text=Louvre+Interior",
    "/placeholder.svg?height=400&width=600&text=Gallery+View",
    "/placeholder.svg?height=400&width=600&text=Architecture",
  ],
  accessibility: {
    wheelchairAccess: true,
    audioGuides: true,
    signLanguage: true,
    braille: true,
  },
  amenities: ["Boutique de souvenirs", "Restaurant", "Café", "Vestiaire", "WiFi gratuit", "Parking"],
}

const reviews = [
  {
    id: 1,
    user: {
      name: "Marie Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      reviewsCount: 47,
      memberSince: "2022",
    },
    rating: 5,
    date: "15 janvier 2024",
    title: "Une expérience inoubliable",
    content:
      "Le Louvre est vraiment exceptionnel. La collection est immense et la qualité des œuvres est remarquable. J'ai particulièrement apprécié la section égyptienne et bien sûr, voir la Joconde en vrai était magique. Le personnel est très accueillant et les audioguides sont excellents.",
    likes: 24,
    helpful: 18,
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    tags: ["Famille", "Éducatif", "Inspirant"],
    replies: [
      {
        id: 1,
        user: {
          name: "Équipe Louvre",
          avatar: "/placeholder.svg?height=40&width=40",
          isMuseumStaff: true,
        },
        content:
          "Merci Marie pour ce merveilleux retour ! Nous sommes ravis que votre visite ait été si enrichissante.",
        date: "16 janvier 2024",
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Pierre Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      reviewsCount: 12,
      memberSince: "2023",
    },
    rating: 4,
    date: "10 janvier 2024",
    title: "Magnifique mais bondé",
    content:
      "Les collections sont absolument magnifiques, mais il y a beaucoup de monde. Je recommande de réserver à l'avance et d'y aller tôt le matin pour éviter les foules. La Joconde était difficile à voir à cause de la foule, mais les autres œuvres valent vraiment le détour.",
    likes: 12,
    helpful: 8,
    tags: ["Bondé", "Conseils"],
    replies: [],
  },
]

const ratingDistribution = {
  5: 8420,
  4: 4200,
  3: 1800,
  2: 600,
  1: 400,
}

export default function MuseumDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Fil d'Ariane">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                Accueil
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link
                href="/museums"
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              >
                Musées
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 dark:text-gray-100" aria-current="page">
              {museumData.name}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src={museumData.images[selectedImageIndex] || "/placeholder.svg"}
                alt={`${museumData.name} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                  <Camera className="w-4 h-4 mr-1" />
                  {museumData.images.length}
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {museumData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    selectedImageIndex === index ? "border-blue-500" : "border-transparent hover:border-gray-300"
                  }`}
                  aria-label={`Voir l'image ${index + 1} de ${museumData.name}`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${museumData.name} - Miniature ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Museum Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{museumData.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{museumData.rating}</span>
                  <span className="text-gray-500">({museumData.totalReviews.toLocaleString()} avis)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">{museumData.name}</h1>

              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{museumData.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <a
                    href={`tel:${museumData.phone}`}
                    className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    {museumData.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <a
                    href={museumData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Site officiel
                  </a>
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{museumData.description}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <FollowButton
                itemId={museumData.id}
                itemType="museum"
                itemName={museumData.name}
                initialFollowing={isFollowing}
              />
              <Button variant="outline" className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent">
                <Bookmark className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>

            {/* Opening Hours Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horaires d'ouverture
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(museumData.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className={hours === "Fermé" ? "text-red-600" : "text-green-600"}>{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="about" className="mb-12">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="about">À propos</TabsTrigger>
            <TabsTrigger value="exhibits">Expositions</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibilité</TabsTrigger>
            <TabsTrigger value="amenities">Services</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Histoire</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{museumData.history}</p>

                <h3 className="text-xl font-semibold mb-3">Œuvres incontournables</h3>
                <ul className="space-y-2">
                  {museumData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Informations pratiques</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Tarifs</h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>Adulte: 17€</li>
                      <li>Moins de 18 ans: Gratuit</li>
                      <li>18-25 ans (UE): Gratuit</li>
                      <li>Étudiants: 14€</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Transport</h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>Métro: Palais-Royal - Musée du Louvre (lignes 1, 7)</li>
                      <li>Bus: lignes 21, 24, 27, 39, 48, 68, 69, 72, 81, 95</li>
                      <li>Parking: Carrousel du Louvre</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exhibits" className="mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Expositions actuelles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {museumData.currentExhibits.map((exhibit) => (
                  <Card key={exhibit.id} className="hover:shadow-lg transition-shadow">
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
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Jusqu'au {exhibit.endDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Accessibilité</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Services disponibles</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility.wheelchairAccess ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Accès en fauteuil roulant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility.audioGuides ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Audioguides disponibles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility.signLanguage ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Visites en langue des signes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility.braille ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Supports en braille</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Informations complémentaires</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Le musée s'engage à accueillir tous les visiteurs dans les meilleures conditions. Des équipements
                    spécialisés sont disponibles à l'accueil. N'hésitez pas à contacter le service des publics pour
                    organiser votre visite.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Services et équipements</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {museumData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <EnhancedReviewSystem
              museumId={museumData.id}
              reviews={reviews}
              averageRating={museumData.rating}
              totalReviews={museumData.totalReviews}
              ratingDistribution={ratingDistribution}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

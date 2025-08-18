"use client"

// Client component for better Cloudflare Pages compatibility
// Static generation approach conflicts with "use client"

import { useState, useEffect } from "react"
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
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import React from "react"

interface MuseumData {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  website: string;
  category: string;
  rating: number;
  totalReviews?: number;
  openingHours: { [key: string]: string } | string;
  description: string;
  history: string;
  highlights: string[];
  currentExhibits: { id: number; title: string; endDate: string; image: string }[];
  images: string[];
  accessibility: {
    wheelchairAccess: boolean;
    audioGuides: boolean;
    signLanguage: boolean;
    braille: boolean;
  };
  amenities: string[];
}

export default function MuseumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [museumData, setMuseumData] = useState<MuseumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<{[key: number]: number}>({})

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setError("Database not configured")
          return
        }

        const { data: museum, error: museumError } = await supabase.from("museums").select("*").eq("id", id).single()
        if (museumError) throw museumError

        const { count: reviewsCount, error: reviewsError } = await supabase
          .from("reviews")
          .select("count", { count: "exact" })
          .eq("museum_id", id)
        if (reviewsError) throw reviewsError

        const { data: exhibits, error: exhibitsError } = await supabase
          .from("exhibits")
          .select("id, title, end_date, image")
          .eq("museum_id", id)
        if (exhibitsError) throw exhibitsError

        // Map end_date to endDate for consistency with the interface
        const formattedExhibits = exhibits?.map(exhibit => ({
          ...exhibit,
          endDate: exhibit.end_date,
        })) || [];

        // Fetch reviews with user data
        const { data: reviewsData, error: reviewsDataError } = await supabase
          .from("reviews")
          .select(`
            *,
            users (
              name,
              avatar,
              verified,
              reviews_count,
              member_since
            )
          `)
          .eq("museum_id", id)
          .order("date", { ascending: false })
          .limit(10)
        if (reviewsDataError) throw reviewsDataError

        // Calculate rating distribution
        const { data: ratingData, error: ratingDataError } = await supabase
          .from("reviews")
          .select("rating")
          .eq("museum_id", id)
        if (ratingDataError) throw ratingDataError

        const distribution: {[key: number]: number} = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        ratingData?.forEach(review => {
          distribution[review.rating] = (distribution[review.rating] || 0) + 1
        })

        setReviews(reviewsData || [])
        setRatingDistribution(distribution)
        setMuseumData({ ...museum, totalReviews: reviewsCount, currentExhibits: formattedExhibits } as MuseumData)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMuseum()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading museum details...</p>
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

  if (!museumData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Museum not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4">

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 pt-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src={
                  (museumData.images && museumData.images.length > 0 && museumData.images[selectedImageIndex]) ||
                  (museumData as any).image ||
                  "/placeholder.svg"
                }
                alt={`${museumData.name} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white">
                  <Camera className="w-4 h-4 mr-1" />
                  {Math.max((museumData.images || []).length, (museumData as any).image ? 1 : 0)}
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {((museumData.images && museumData.images.length > 0) || (museumData as any).image) && (
              <div className="grid grid-cols-4 gap-2">
                {(museumData.images && museumData.images.length > 0 ? museumData.images : [(museumData as any).image]).filter(Boolean).map((image, index) => (
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
            )}
          </div>

          {/* Museum Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{museumData.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{museumData.rating}</span>
                  <span className="text-gray-500">({museumData.totalReviews?.toLocaleString() || '0'} avis)</span>
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
                  {typeof museumData.openingHours === 'string' && museumData.openingHours.trim() !== '' ? (
                    <div className="flex justify-between">
                      <span>{museumData.openingHours}</span>
                    </div>
                  ) : (
                    Object.keys(museumData.openingHours || {}).length > 0 ? (
                      Object.entries(museumData.openingHours || {}).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}</span>
                          <span className={hours === "Fermé" ? "text-red-600" : "text-green-600"}>{hours}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Horaires non disponibles.</p>
                    )
                  )}
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
                  {(museumData.highlights || []).map((highlight, index) => (
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
                {(museumData.currentExhibits || []).map((exhibit) => (
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
                        className={`w-4 h-4 rounded-full ${museumData.accessibility?.wheelchairAccess ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Accès en fauteuil roulant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility?.audioGuides ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Audioguides disponibles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility?.signLanguage ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>Visites en langue des signes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${museumData.accessibility?.braille ? "bg-green-500" : "bg-red-500"}`}
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
                {(museumData.amenities || []).map((amenity, index) => (
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
              totalReviews={museumData.totalReviews || 0}
              ratingDistribution={ratingDistribution}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

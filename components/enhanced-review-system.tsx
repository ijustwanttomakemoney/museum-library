"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ThumbsUp, Flag, Camera, Star, MoreHorizontal, Reply } from "lucide-react"
import Image from "next/image"
import StarRating from "./star-rating"

interface Review {
  id: number
  user: {
    name: string
    avatar: string
    verified: boolean
    reviewsCount: number
    memberSince: string
  }
  rating: number
  date: string
  title: string
  content: string
  likes: number
  helpful: number
  images?: string[]
  replies?: ReviewReply[]
  tags: string[]
}

interface ReviewReply {
  id: number
  user: {
    name: string
    avatar: string
    isMuseumStaff: boolean
  }
  content: string
  date: string
  likes: number
}

interface EnhancedReviewSystemProps {
  museumId: number
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
}

export default function EnhancedReviewSystem({
  museumId,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: EnhancedReviewSystemProps) {
  const [userRating, setUserRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent")
  const [filterByRating, setFilterByRating] = useState<number | null>(null)

  const availableTags = [
    "Famille",
    "Couple",
    "Solo",
    "Accessible",
    "Éducatif",
    "Inspirant",
    "Bondé",
    "Calme",
    "Interactif",
    "Photogénique",
  ]

  const handleSubmitReview = async () => {
    if (userRating === 0 || !reviewContent.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form
    setUserRating(0)
    setReviewTitle("")
    setReviewContent("")
    setSelectedTags([])
    setUploadedImages([])
    setIsSubmitting(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages((prev) => [...prev, ...files].slice(0, 5)) // Max 5 images
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 5)))
  }

  const filteredAndSortedReviews = reviews
    .filter((review) => (filterByRating ? review.rating === filterByRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return b.helpful - a.helpful
        case "rating":
          return b.rating - a.rating
        case "recent":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  return (
    <section className="space-y-8" aria-labelledby="reviews-heading">
      <div>
        <h2 id="reviews-heading" className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Avis et évaluations
        </h2>

        {/* Enhanced Rating Summary */}
        <div className="gradient-card rounded-2xl p-8 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <div className="text-lg text-gray-600 dark:text-gray-400 mt-3">
                Basé sur {totalReviews.toLocaleString()} avis
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-4">Répartition des notes</h3>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                return (
                  <button
                    key={stars}
                    onClick={() => setFilterByRating(filterByRating === stars ? null : stars)}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      filterByRating === stars ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    aria-label={`Filtrer par ${stars} étoiles (${count} avis)`}
                  >
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Write Review Form */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Partagez votre expérience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Votre note *</label>
              <StarRating
                rating={userRating}
                interactive
                size="lg"
                onRatingChange={setUserRating}
                className="justify-center md:justify-start"
              />
            </div>

            <div>
              <label htmlFor="review-title" className="block text-sm font-semibold mb-2">
                Titre de votre avis (optionnel)
              </label>
              <input
                id="review-title"
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Résumez votre expérience en quelques mots..."
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white dark:bg-gray-800 dark:text-white transition-all duration-200"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="review-content" className="block text-sm font-semibold mb-2">
                Votre avis détaillé *
              </label>
              <Textarea
                id="review-content"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Partagez votre expérience, ce que vous avez aimé, vos conseils pour d'autres visiteurs..."
                rows={5}
                className="resize-none border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                maxLength={2000}
                required
                aria-describedby="review-content-help"
              />
              <div id="review-content-help" className="text-sm text-gray-500 mt-2 flex justify-between">
                <span>Soyez précis et constructif dans votre avis</span>
                <span>{reviewContent.length}/2000 caractères</span>
              </div>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Tags (sélectionnez jusqu'à 5 qui décrivent votre visite)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                    aria-pressed={selectedTags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-3">Ajoutez des photos (optionnel, max 5)</label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadedImages.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    uploadedImages.length >= 5
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : "border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  }`}
                >
                  <div className="text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {uploadedImages.length >= 5 ? "Maximum 5 images atteint" : "Cliquez pour ajouter des photos"}
                    </p>
                  </div>
                </label>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-label={`Supprimer la photo ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={userRating === 0 || !reviewContent.trim() || isSubmitting}
              className="w-full md:w-auto btn-apple text-lg py-3 px-8"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2" />
                  Publication en cours...
                </>
              ) : (
                "Publier mon avis"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sort and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium">
              Trier par:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "helpful" | "rating")}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white dark:bg-gray-800"
            >
              <option value="recent">Plus récents</option>
              <option value="helpful">Plus utiles</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          {filterByRating && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Filtré par {filterByRating} étoiles</span>
              <Button variant="outline" size="sm" onClick={() => setFilterByRating(null)} className="rounded-full">
                Supprimer le filtre
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage
                      src={review.user.avatar || "/placeholder.svg"}
                      alt={`Photo de profil de ${review.user.name}`}
                    />
                    <AvatarFallback className="text-lg">
                      {review.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-lg">{review.user.name}</h3>
                      {review.user.verified && <Badge className="bg-blue-100 text-blue-800 text-xs">Vérifié</Badge>}
                      <div className="text-sm text-gray-500">
                        {review.user.reviewsCount} avis • Membre depuis {review.user.memberSince}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>

                    {review.title && <h4 className="font-semibold text-lg mb-3">{review.title}</h4>}

                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{review.content}</p>

                    {/* Tags */}
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <Dialog key={index}>
                            <DialogTrigger asChild>
                              <button className="relative h-20 rounded-lg overflow-hidden hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Photo ${index + 1} de l'avis de ${review.user.name}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Photo de {review.user.name}</DialogTitle>
                              </DialogHeader>
                              <div className="relative h-96">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Photo ${index + 1} de l'avis de ${review.user.name}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mb-4">
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1">
                        <ThumbsUp className="w-4 h-4" />
                        Utile ({review.helpful})
                      </button>

                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded px-2 py-1">
                        <Reply className="w-4 h-4" />
                        Répondre
                      </button>

                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1">
                        <Flag className="w-4 h-4" />
                        Signaler
                      </button>

                      <button className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Replies */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-4">
                        {review.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={reply.user.avatar || "/placeholder.svg"}
                                alt={`Photo de profil de ${reply.user.name}`}
                              />
                              <AvatarFallback className="text-xs">
                                {reply.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.user.name}</span>
                                {reply.user.isMuseumStaff && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Équipe du musée</Badge>
                                )}
                                <span className="text-xs text-gray-500">{reply.date}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{reply.content}</p>
                              <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                                <ThumbsUp className="w-3 h-3 inline mr-1" />
                                {reply.likes}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Reviews Message */}
        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-xl font-semibold mb-2">
              {filterByRating ? "Aucun avis trouvé pour cette note" : "Aucun avis pour le moment"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filterByRating
                ? "Essayez de supprimer le filtre pour voir tous les avis."
                : "Soyez le premier à partager votre expérience de visite !"}
            </p>
            {filterByRating && (
              <Button onClick={() => setFilterByRating(null)} variant="outline" className="rounded-xl">
                Voir tous les avis
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

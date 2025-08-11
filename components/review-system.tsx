"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, Flag } from "lucide-react"

interface Review {
  id: number
  user: {
    name: string
    avatar: string
    verified: boolean
  }
  rating: number
  date: string
  title: string
  content: string
  likes: number
  helpful: number
  images?: string[]
}

interface ReviewSystemProps {
  museumId: number
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ReviewSystem({ museumId, reviews, averageRating, totalReviews }: ReviewSystemProps) {
  const [userRating, setUserRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStarClick = (rating: number) => {
    setUserRating(rating)
  }

  const handleSubmitReview = async () => {
    if (userRating === 0 || !reviewContent.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setUserRating(0)
    setReviewTitle("")
    setReviewContent("")
    setIsSubmitting(false)
  }

  const StarRating = ({
    rating,
    interactive = false,
    size = "w-5 h-5",
    onStarClick,
  }: {
    rating: number
    interactive?: boolean
    size?: string
    onStarClick?: (rating: number) => void
  }) => (
    <div
      className="flex items-center gap-1"
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Note sur 5 étoiles" : `Note: ${rating} sur 5 étoiles`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${size} ${interactive ? "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" : "cursor-default"} transition-all`}
          onClick={() => interactive && onStarClick?.(star)}
          onKeyDown={(e) => {
            if (interactive && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault()
              onStarClick?.(star)
            }
          }}
          disabled={!interactive}
          aria-label={interactive ? `Noter ${star} étoile${star > 1 ? "s" : ""}` : undefined}
          role={interactive ? "radio" : undefined}
          aria-checked={interactive ? star <= rating : undefined}
        >
          <Star
            className={`${size} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <section className="space-y-8" aria-labelledby="reviews-heading">
      <div>
        <h2 id="reviews-heading" className="text-2xl font-semibold mb-4">
          Avis et évaluations
        </h2>

        {/* Rating Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{totalReviews} avis</div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-8">{stars}★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${count} avis ${stars} étoiles, ${percentage.toFixed(1)}%`}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Write Review Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Écrire un avis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Votre note *</label>
              <StarRating rating={userRating} interactive size="w-8 h-8" onStarClick={handleStarClick} />
            </div>

            <div>
              <label htmlFor="review-title" className="block text-sm font-medium mb-2">
                Titre de votre avis (optionnel)
              </label>
              <input
                id="review-title"
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Résumez votre expérience..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="review-content" className="block text-sm font-medium mb-2">
                Votre avis *
              </label>
              <Textarea
                id="review-content"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Partagez votre expérience, ce que vous avez aimé ou moins aimé..."
                rows={4}
                className="resize-none"
                maxLength={1000}
                required
                aria-describedby="review-content-help"
              />
              <div id="review-content-help" className="text-sm text-gray-500 mt-1">
                {reviewContent.length}/1000 caractères
              </div>
            </div>

            <Button
              onClick={handleSubmitReview}
              disabled={userRating === 0 || !reviewContent.trim() || isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Publication..." : "Publier l'avis"}
            </Button>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={review.user.avatar || "/placeholder.svg"}
                      alt={`Photo de profil de ${review.user.name}`}
                    />
                    <AvatarFallback>
                      {review.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{review.user.name}</h3>
                      {review.user.verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Vérifié</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>

                    {review.title && <h4 className="font-medium mb-2">{review.title}</h4>}

                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{review.content}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Photo ${index + 1} de l'avis de ${review.user.name}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                        aria-label={`${review.likes} personnes ont trouvé cet avis utile`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Utile ({review.likes})
                      </button>

                      <button
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                        aria-label="Signaler cet avis"
                      >
                        <Flag className="w-4 h-4" />
                        Signaler
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

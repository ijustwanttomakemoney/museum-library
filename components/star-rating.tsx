"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export default function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = "md",
  showLabel = false,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, starRating: number) => {
    if (interactive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      handleStarClick(starRating)
    }
  }

  const getStarColor = (starIndex: number) => {
    const currentRating = interactive ? hoverRating || rating : rating
    return starIndex <= currentRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className="flex items-center gap-1"
        role={interactive ? "radiogroup" : undefined}
        aria-label={interactive ? "Évaluation sur 5 étoiles" : `Évaluation: ${rating} sur 5 étoiles`}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            type="button"
            className={`${sizeClasses[size]} ${
              interactive
                ? "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-all duration-200"
                : "cursor-default"
            } ${getStarColor(starIndex)}`}
            onClick={() => interactive && handleStarClick(starIndex)}
            onKeyDown={(e) => handleKeyDown(e, starIndex)}
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            aria-label={interactive ? `Noter ${starIndex} étoile${starIndex > 1 ? "s" : ""}` : undefined}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? starIndex <= rating : undefined}
            tabIndex={interactive ? 0 : -1}
          >
            <Star className={`${sizeClasses[size]} transition-all duration-200`} />
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">{rating.toFixed(1)} sur 5</span>
      )}
    </div>
  )
}

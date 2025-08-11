"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Bell } from "lucide-react"

interface FollowButtonProps {
  itemId: number
  itemType: "museum" | "exhibit"
  itemName: string
  initialFollowing?: boolean
}

export default function FollowButton({ itemId, itemType, itemName, initialFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFollow = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsFollowing(!isFollowing)
    setIsLoading(false)

    // Show notification (you could use a toast library here)
    if (!isFollowing) {
      console.log(`Vous suivez maintenant ${itemName}`)
    } else {
      console.log(`Vous ne suivez plus ${itemName}`)
    }
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      variant={isFollowing ? "default" : "outline"}
      className={`transition-all duration-200 ${
        isFollowing ? "bg-red-500 hover:bg-red-600 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
      aria-label={isFollowing ? `Ne plus suivre ${itemName}` : `Suivre ${itemName} pour recevoir des notifications`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : isFollowing ? (
        <Bell className="w-4 h-4 mr-2" />
      ) : (
        <Heart className="w-4 h-4 mr-2" />
      )}
      {isFollowing ? "Suivi" : "Suivre"}
    </Button>
  )
}

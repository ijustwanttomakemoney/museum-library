"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, ThumbsUp, Pin, Clock } from "lucide-react"

interface ForumPost {
  id: number
  title: string
  content: string
  author: {
    name: string
    avatar: string
    badge?: string
  }
  category: string
  replies: number
  likes: number
  isPinned: boolean
  createdAt: string
  lastActivity: string
}

const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "Quelle est votre exposition préférée au Louvre ?",
    content:
      "Je visite le Louvre régulièrement et j'aimerais connaître vos expositions favorites. Personnellement, j'adore la section égyptienne !",
    author: {
      name: "Marie Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      badge: "Expert",
    },
    category: "Discussion",
    replies: 23,
    likes: 45,
    isPinned: true,
    createdAt: "2024-01-20",
    lastActivity: "Il y a 2 heures",
  },
  {
    id: 2,
    title: "Conseils pour visiter Orsay avec des enfants",
    content:
      "Bonjour ! Je prévois une visite au Musée d'Orsay avec mes enfants de 8 et 12 ans. Avez-vous des conseils pour rendre la visite plus interactive ?",
    author: {
      name: "Pierre Martin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Conseils",
    replies: 12,
    likes: 28,
    isPinned: false,
    createdAt: "2024-01-19",
    lastActivity: "Il y a 4 heures",
  },
  {
    id: 3,
    title: "Nouvelle exposition Picasso - Vos impressions ?",
    content: "J'ai eu la chance de voir la nouvelle exposition Picasso au Centre Pompidou. Qu'en avez-vous pensé ?",
    author: {
      name: "Sophie Laurent",
      avatar: "/placeholder.svg?height=40&width=40",
      badge: "Contributeur",
    },
    category: "Actualités",
    replies: 8,
    likes: 15,
    isPinned: false,
    createdAt: "2024-01-18",
    lastActivity: "Il y a 1 jour",
  },
]

export default function CommunityForum() {
  const [activeTab, setActiveTab] = useState("all")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setNewPostTitle("")
    setNewPostContent("")
    setIsSubmitting(false)
  }

  const filteredPosts = forumPosts.filter((post) => {
    if (activeTab === "all") return true
    return post.category.toLowerCase() === activeTab
  })

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Forum Communautaire</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Échangez avec d'autres passionnés de culture, partagez vos expériences et découvrez de nouveaux points de vue
        </p>
      </div>

      {/* New Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>Créer une nouvelle discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium mb-2">
              Titre de votre discussion *
            </label>
            <input
              id="post-title"
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="De quoi souhaitez-vous parler ?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="post-content" className="block text-sm font-medium mb-2">
              Votre message *
            </label>
            <Textarea
              id="post-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Partagez vos pensées, questions ou expériences..."
              rows={4}
              className="resize-none"
              maxLength={2000}
            />
            <div className="text-sm text-gray-500 mt-1">{newPostContent.length}/2000 caractères</div>
          </div>

          <Button
            onClick={handleSubmitPost}
            disabled={!newPostTitle.trim() || !newPostContent.trim() || isSubmitting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? "Publication..." : "Publier la discussion"}
          </Button>
        </CardContent>
      </Card>

      {/* Forum Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="discussion">Discussions</TabsTrigger>
          <TabsTrigger value="conseils">Conseils</TabsTrigger>
          <TabsTrigger value="actualités">Actualités</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={`Photo de profil de ${post.author.name}`}
                      />
                      <AvatarFallback>
                        {post.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && <Pin className="w-4 h-4 text-blue-500" aria-label="Discussion épinglée" />}
                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">{post.title}</h3>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium">{post.author.name}</span>
                        {post.author.badge && (
                          <Badge variant="outline" className="text-xs">
                            {post.author.badge}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.createdAt}</span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{post.content}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies} réponses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes} j'aime</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Dernière activité: {post.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Community Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Statistiques de la communauté</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">3,891</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">12,456</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

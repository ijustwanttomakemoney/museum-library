"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MapPin, Calendar, Heart, Star, Camera, Edit, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"

const userProfile = {
  name: "Marie Dubois",
  username: "@marie_dubois",
  bio: "Passionnée d'art et d'histoire, j'adore découvrir de nouveaux musées et partager mes coups de cœur culturels.",
  location: "Paris, France",
  joinDate: "Janvier 2023",
  avatar: "/placeholder.svg?height=100&width=100",
  stats: {
    museumsVisited: 47,
    reviewsWritten: 23,
    favoritesCount: 15,
    followersCount: 156,
  },
}

const favoriteMuseums = [
  {
    id: 1,
    name: "Musée d'Orsay",
    location: "Paris",
    image: "/musee-dorsay-interior.png",
    rating: 5,
    visitDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Centre Pompidou",
    location: "Paris",
    image: "/centre-pompidou-modern-art.png",
    rating: 4,
    visitDate: "2024-01-08",
  },
  {
    id: 3,
    name: "Musée Rodin",
    location: "Paris",
    image: "/placeholder.svg?height=150&width=200",
    rating: 5,
    visitDate: "2023-12-20",
  },
]

const recentReviews = [
  {
    id: 1,
    museum: "Musée Picasso",
    rating: 4,
    date: "2024-01-20",
    review:
      "Une collection exceptionnelle dans un cadre magnifique. Les œuvres de la période bleue sont particulièrement émouvantes.",
    likes: 12,
  },
  {
    id: 2,
    museum: "Musée des Arts Décoratifs",
    rating: 5,
    date: "2024-01-10",
    review:
      "Un musée souvent méconnu mais qui mérite vraiment le détour. Les collections de mobilier et d'objets d'art sont remarquables.",
    likes: 8,
  },
]

const recentActivity = [
  {
    id: 1,
    type: "visit",
    museum: "Musée de l'Orangerie",
    date: "2024-01-25",
    action: "a visité",
  },
  {
    id: 2,
    type: "review",
    museum: "Musée Picasso",
    date: "2024-01-20",
    action: "a écrit un avis sur",
  },
  {
    id: 3,
    type: "favorite",
    museum: "Musée Rodin",
    date: "2024-01-15",
    action: "a ajouté aux favoris",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    name: userProfile.name,
    bio: userProfile.bio,
    location: userProfile.location,
  })

  const handleSaveProfile = () => {
    // Here you would typically save to a backend
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Profile Header */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full p-2 bg-transparent"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Changer la photo de profil</DialogTitle>
                        <DialogDescription>Téléchargez une nouvelle photo de profil</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input type="file" accept="image/*" />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Annuler</Button>
                          <Button>Sauvegarder</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="text-center md:text-left mt-4">
                  <h1 className="text-2xl font-serif font-bold">{userProfile.name}</h1>
                  <p className="text-gray-600">{userProfile.username}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-700 mb-4">{userProfile.bio}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Membre depuis {userProfile.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le profil</DialogTitle>
                        <DialogDescription>Modifiez vos informations personnelles</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nom</Label>
                          <Input
                            id="name"
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Localisation</Label>
                          <Input
                            id="location"
                            value={editedProfile.location}
                            onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleSaveProfile}>Sauvegarder</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userProfile.stats.museumsVisited}</div>
                    <div className="text-sm text-gray-600">Musées visités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userProfile.stats.reviewsWritten}</div>
                    <div className="text-sm text-gray-600">Avis écrits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{userProfile.stats.favoritesCount}</div>
                    <div className="text-sm text-gray-600">Favoris</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userProfile.stats.followersCount}</div>
                    <div className="text-sm text-gray-600">Abonnés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="favorites">Favoris</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
                <TabsTrigger value="activity">Activité</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="favorites" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Musées Favoris</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteMuseums.map((museum) => (
                      <Card key={museum.id} className="hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-32">
                          <Image
                            src={museum.image || "/placeholder.svg"}
                            alt={museum.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{museum.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{museum.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < museum.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Visité le {museum.visitDate}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Mes Avis</h2>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{review.museum}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-gray-700 mb-4">{review.review}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Heart className="h-4 w-4" />
                            <span>{review.likes} j'aime</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Activité Récente</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{userProfile.name}</span> {activity.action}{" "}
                                <Link href={`/museums/${activity.id}`} className="text-blue-600 hover:underline">
                                  {activity.museum}
                                </Link>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Paramètres</h2>
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Gérez vos préférences de notification</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Nouvelles expositions</p>
                            <p className="text-sm text-gray-600">
                              Recevoir des notifications pour les nouvelles expositions
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Activé
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Événements à proximité</p>
                            <p className="text-sm text-gray-600">Notifications pour les événements près de chez vous</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Activé
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-gray-600">Recevoir la newsletter hebdomadaire</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Désactivé
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Confidentialité</CardTitle>
                        <CardDescription>Contrôlez la visibilité de votre profil</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Profil public</p>
                            <p className="text-sm text-gray-600">
                              Permettre aux autres utilisateurs de voir votre profil
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Activé
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Avis publics</p>
                            <p className="text-sm text-gray-600">Rendre vos avis visibles par tous</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Activé
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Compte</CardTitle>
                        <CardDescription>Gérez votre compte</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Settings className="h-4 w-4 mr-2" />
                          Changer le mot de passe
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          Télécharger mes données
                        </Button>
                        <Button variant="destructive" className="w-full justify-start">
                          Supprimer le compte
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
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

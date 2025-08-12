#!/usr/bin/env node

// Database seeding script for Museum Library
// This script populates the Supabase database with sample data from mock-data.ts

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Import mock data
import { mockMuseums, mockArtists, mockArtworks, mockUsers, mockReviews } from '../lib/mock-data.ts'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...')
    await supabase.from('review_replies').delete().neq('id', 0)
    await supabase.from('reviews').delete().neq('id', 0)
    await supabase.from('exhibits').delete().neq('id', 0)
    await supabase.from('artworks').delete().neq('id', 0)
    await supabase.from('artists').delete().neq('id', 0)
    await supabase.from('users').delete().neq('id', 0)
    await supabase.from('museums').delete().neq('id', 0)

    // Reset sequences
    console.log('🔄 Resetting sequences...')
    await supabase.rpc('setval', { sequence_name: 'museums_id_seq', new_value: 1, is_called: false })
    await supabase.rpc('setval', { sequence_name: 'artists_id_seq', new_value: 1, is_called: false })
    await supabase.rpc('setval', { sequence_name: 'artworks_id_seq', new_value: 1, is_called: false })
    await supabase.rpc('setval', { sequence_name: 'users_id_seq', new_value: 1, is_called: false })
    await supabase.rpc('setval', { sequence_name: 'reviews_id_seq', new_value: 1, is_called: false })

    // Seed museums
    console.log('🏛️  Seeding museums...')
    const museumData = mockMuseums.map(museum => ({
      id: museum.id,
      name: museum.name,
      location: museum.location,
      region: museum.region,
      category: museum.category,
      image: museum.image,
      rating: museum.rating,
      opening_hours: museum.openingHours,
      description: museum.description,
      visitors: museum.visitors,
      address: museum.address,
      phone: museum.phone,
      website: museum.website,
      history: museum.history,
      highlights: museum.highlights,
      accessibility: museum.accessibility,
      amenities: museum.amenities,
      images: museum.images
    }))

    const { error: museumError } = await supabase
      .from('museums')
      .insert(museumData)

    if (museumError) {
      console.error('❌ Error seeding museums:', museumError)
      throw museumError
    }
    console.log(`✅ Seeded ${museumData.length} museums`)

    // Seed exhibits
    console.log('🎨 Seeding exhibits...')
    const exhibitData = []
    mockMuseums.forEach(museum => {
      if (museum.currentExhibits) {
        museum.currentExhibits.forEach(exhibit => {
          exhibitData.push({
            id: exhibit.id,
            title: exhibit.title,
            end_date: exhibit.endDate,
            image: exhibit.image,
            description: exhibit.description,
            museum_id: exhibit.museumId,
            start_date: exhibit.startDate,
            ticket_price: exhibit.ticketPrice
          })
        })
      }
    })

    if (exhibitData.length > 0) {
      const { error: exhibitError } = await supabase
        .from('exhibits')
        .insert(exhibitData)

      if (exhibitError) {
        console.error('❌ Error seeding exhibits:', exhibitError)
        throw exhibitError
      }
      console.log(`✅ Seeded ${exhibitData.length} exhibits`)
    }

    // Seed artists
    console.log('👨‍🎨 Seeding artists...')
    const artistData = mockArtists.map(artist => ({
      id: artist.id,
      name: artist.name,
      birth_year: artist.birthYear,
      death_year: artist.deathYear,
      nationality: artist.nationality,
      biography: artist.biography,
      style: artist.style,
      famous_works: artist.famousWorks,
      image: artist.image,
      artworks_count: artist.artworksCount
    }))

    const { error: artistError } = await supabase
      .from('artists')
      .insert(artistData)

    if (artistError) {
      console.error('❌ Error seeding artists:', artistError)
      throw artistError
    }
    console.log(`✅ Seeded ${artistData.length} artists`)

    // Seed artworks
    console.log('🖼️  Seeding artworks...')
    const artworkData = mockArtworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      artist_id: artwork.artistId,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      description: artwork.description,
      image: artwork.image,
      style: artwork.style,
      rating: artwork.rating,
      museum: artwork.museum,
      museum_id: artwork.museumId,
      is_on_display: artwork.isOnDisplay,
      acquisition_date: artwork.acquisitionDate,
      estimated_value: artwork.estimatedValue
    }))

    const { error: artworkError } = await supabase
      .from('artworks')
      .insert(artworkData)

    if (artworkError) {
      console.error('❌ Error seeding artworks:', artworkError)
      throw artworkError
    }
    console.log(`✅ Seeded ${artworkData.length} artworks`)

    // Seed users
    console.log('👥 Seeding users...')
    const userData = mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verified: user.verified,
      reviews_count: user.reviewsCount,
      member_since: user.memberSince,
      favorite_museums: user.favoriteMuseums,
      favorite_artworks: user.favoriteArtworks
    }))

    const { error: userError } = await supabase
      .from('users')
      .insert(userData)

    if (userError) {
      console.error('❌ Error seeding users:', userError)
      throw userError
    }
    console.log(`✅ Seeded ${userData.length} users`)

    // Seed reviews
    console.log('⭐ Seeding reviews...')
    const reviewData = mockReviews.map(review => ({
      id: review.id,
      user_id: review.userId,
      museum_id: review.museumId,
      artwork_id: review.artworkId,
      rating: review.rating,
      title: review.title,
      content: review.content,
      date: review.date,
      likes: review.likes,
      helpful: review.helpful,
      images: review.images,
      tags: review.tags,
      verified: review.verified
    }))

    const { error: reviewError } = await supabase
      .from('reviews')
      .insert(reviewData)

    if (reviewError) {
      console.error('❌ Error seeding reviews:', reviewError)
      throw reviewError
    }
    console.log(`✅ Seeded ${reviewData.length} reviews`)

    // Update sequences to continue from the seeded data
    console.log('🔢 Updating sequences...')
    await supabase.rpc('setval', { sequence_name: 'museums_id_seq', new_value: Math.max(...museumData.map(m => m.id)), is_called: true })
    await supabase.rpc('setval', { sequence_name: 'artists_id_seq', new_value: Math.max(...artistData.map(a => a.id)), is_called: true })
    await supabase.rpc('setval', { sequence_name: 'artworks_id_seq', new_value: Math.max(...artworkData.map(a => a.id)), is_called: true })
    await supabase.rpc('setval', { sequence_name: 'users_id_seq', new_value: Math.max(...userData.map(u => u.id)), is_called: true })
    await supabase.rpc('setval', { sequence_name: 'reviews_id_seq', new_value: Math.max(...reviewData.map(r => r.id)), is_called: true })

    console.log('🎉 Database seeding completed successfully!')
    console.log('')
    console.log('📊 Seeded data summary:')
    console.log(`   🏛️  ${museumData.length} museums`)
    console.log(`   🎨 ${exhibitData.length} exhibits`)
    console.log(`   👨‍🎨 ${artistData.length} artists`)
    console.log(`   🖼️  ${artworkData.length} artworks`)
    console.log(`   👥 ${userData.length} users`)
    console.log(`   ⭐ ${reviewData.length} reviews`)
    console.log('')
    console.log('Your Museum Library database is now ready! 🚀')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Add RPC function for setval if it doesn't exist
async function ensureSetvalFunction() {
  const { error } = await supabase.rpc('create_setval_function')
  if (error && !error.message.includes('already exists')) {
    console.warn('Could not create setval function, sequences may not reset properly')
  }
}

// Run the seeding
ensureSetvalFunction().then(() => {
  seedDatabase()
})

-- Museum Library Database Schema for Supabase/PostgreSQL
-- This schema creates all the necessary tables for the museum library application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE museum_category AS ENUM ('Art', 'Histoire', 'Sciences', 'Impressionnisme', 'Art Moderne', 'Sculpture');
CREATE TYPE artwork_style AS ENUM ('Renaissance', 'Impressionnisme', 'Romantisme', 'Cubisme', 'Sculpture moderne', 'Art contemporain');

-- Museums table
CREATE TABLE IF NOT EXISTS museums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    category museum_category NOT NULL,
    image TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    visitors VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    website TEXT,
    history TEXT,
    highlights TEXT[] DEFAULT '{}',
    accessibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    nationality VARCHAR(100),
    biography TEXT,
    style artwork_style,
    famous_works TEXT[] DEFAULT '{}',
    image TEXT,
    artworks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_birth_year CHECK (birth_year > 0 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    CONSTRAINT valid_death_year CHECK (death_year IS NULL OR (death_year > birth_year AND death_year <= EXTRACT(YEAR FROM CURRENT_DATE)))
);

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
    year INTEGER,
    medium VARCHAR(255),
    dimensions VARCHAR(100),
    description TEXT,
    image TEXT,
    style artwork_style,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    museum VARCHAR(255) NOT NULL,
    museum_id INTEGER REFERENCES museums(id) ON DELETE CASCADE,
    is_on_display BOOLEAN DEFAULT true,
    acquisition_date DATE,
    estimated_value DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_year CHECK (year > 0 AND year <= EXTRACT(YEAR FROM CURRENT_DATE))
);

-- Exhibits table
CREATE TABLE IF NOT EXISTS exhibits (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    end_date DATE NOT NULL,
    image TEXT,
    description TEXT,
    museum_id INTEGER REFERENCES museums(id) ON DELETE CASCADE,
    start_date DATE,
    ticket_price DECIMAL(8,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_exhibit_dates CHECK (start_date IS NULL OR end_date >= start_date)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    verified BOOLEAN DEFAULT false,
    reviews_count INTEGER DEFAULT 0,
    member_since VARCHAR(4) NOT NULL,
    favorite_museums INTEGER[] DEFAULT '{}',
    favorite_artworks INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    museum_id INTEGER REFERENCES museums(id) ON DELETE CASCADE,
    artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    likes INTEGER DEFAULT 0,
    helpful INTEGER DEFAULT 0,
    images TEXT[],
    tags TEXT[] DEFAULT '{}',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Review replies table
CREATE TABLE IF NOT EXISTS review_replies (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    likes INTEGER DEFAULT 0,
    is_museum_staff BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_museums_region ON museums(region);
CREATE INDEX IF NOT EXISTS idx_museums_category ON museums(category);
CREATE INDEX IF NOT EXISTS idx_museums_rating ON museums(rating);
CREATE INDEX IF NOT EXISTS idx_artworks_museum_id ON artworks(museum_id);
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_style ON artworks(style);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON artworks(year);
CREATE INDEX IF NOT EXISTS idx_exhibits_museum_id ON exhibits(museum_id);
CREATE INDEX IF NOT EXISTS idx_exhibits_dates ON exhibits(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reviews_museum_id ON reviews(museum_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON review_replies(review_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_museums_search ON museums USING gin(to_tsvector('french', name || ' ' || location || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_artworks_search ON artworks USING gin(to_tsvector('french', title || ' ' || artist || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_artists_search ON artists USING gin(to_tsvector('french', name || ' ' || biography));

-- Functions for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at updates
CREATE TRIGGER update_museums_updated_at BEFORE UPDATE ON museums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exhibits_updated_at BEFORE UPDATE ON exhibits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_replies_updated_at BEFORE UPDATE ON review_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update artworks count for artists
CREATE OR REPLACE FUNCTION update_artist_artworks_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE artists SET artworks_count = artworks_count + 1 WHERE id = NEW.artist_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE artists SET artworks_count = artworks_count - 1 WHERE id = OLD.artist_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.artist_id != NEW.artist_id THEN
            UPDATE artists SET artworks_count = artworks_count - 1 WHERE id = OLD.artist_id;
            UPDATE artists SET artworks_count = artworks_count + 1 WHERE id = NEW.artist_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for updating artist artwork counts
CREATE TRIGGER update_artist_artworks_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON artworks
    FOR EACH ROW EXECUTE FUNCTION update_artist_artworks_count();

-- Function to update user reviews count
CREATE OR REPLACE FUNCTION update_user_reviews_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET reviews_count = reviews_count + 1 WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET reviews_count = reviews_count - 1 WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for updating user review counts
CREATE TRIGGER update_user_reviews_count_trigger
    AFTER INSERT OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_reviews_count();

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE museums ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibits ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;

-- Public read access for museums, artists, artworks, and exhibits
CREATE POLICY "Public museums read access" ON museums FOR SELECT USING (true);
CREATE POLICY "Public artists read access" ON artists FOR SELECT USING (true);
CREATE POLICY "Public artworks read access" ON artworks FOR SELECT USING (true);
CREATE POLICY "Public exhibits read access" ON exhibits FOR SELECT USING (true);

-- Users can read their own data and public profiles
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id::text OR true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Reviews and replies policies
CREATE POLICY "Public reviews read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public review replies read access" ON review_replies FOR SELECT USING (true);
CREATE POLICY "Users can create review replies" ON review_replies FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own review replies" ON review_replies FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own review replies" ON review_replies FOR DELETE USING (auth.uid()::text = user_id::text);

-- Admin policies (you can modify these based on your admin setup)
-- CREATE POLICY "Admins can manage museums" ON museums FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "Admins can manage artists" ON artists FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "Admins can manage artworks" ON artworks FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "Admins can manage exhibits" ON exhibits FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

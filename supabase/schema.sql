-- Script SQL à exécuter dans l'éditeur SQL de Supabase
-- Allez dans: Supabase Dashboard > SQL Editor > New Query

-- Créer la table poop_logs
CREATE TABLE poop_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  address TEXT, -- Adresse géolocalisée (peut être null si géolocalisation refusée)
  latitude DOUBLE PRECISION, -- Coordonnées GPS
  longitude DOUBLE PRECISION,
  poop_type VARCHAR(10) NOT NULL CHECK (poop_type IN ('type1', 'type2', 'type3', 'type4', 'type5', 'type6', 'type7')),
  size VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (size IN ('small', 'medium', 'normal', 'big', 'monster', 'destroyer')),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration pour ajouter les colonnes à une table existante:
-- ALTER TABLE poop_logs ADD COLUMN address TEXT;
-- ALTER TABLE poop_logs ADD COLUMN latitude DOUBLE PRECISION;
-- ALTER TABLE poop_logs ADD COLUMN longitude DOUBLE PRECISION;
-- ALTER TABLE poop_logs ADD COLUMN size VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (size IN ('small', 'medium', 'normal', 'big', 'monster', 'destroyer'));

-- Activer Row Level Security (RLS)
ALTER TABLE poop_logs ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut voir tous les logs (pour la carte)
CREATE POLICY "Anyone can view all poop_logs" ON poop_logs
  FOR SELECT
  USING (true);

-- Politique: les utilisateurs ne peuvent insérer que leurs propres logs
CREATE POLICY "Users can insert own poop_logs" ON poop_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique: les utilisateurs ne peuvent mettre à jour que leurs propres logs
CREATE POLICY "Users can update own poop_logs" ON poop_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique: les utilisateurs ne peuvent supprimer que leurs propres logs
CREATE POLICY "Users can delete own poop_logs" ON poop_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_poop_logs_user_id ON poop_logs(user_id);
CREATE INDEX idx_poop_logs_date ON poop_logs(date DESC);

-- Créer la table location_tags pour les lieux personnalisés
CREATE TABLE location_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) DEFAULT '📍',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Activer Row Level Security (RLS) pour location_tags
ALTER TABLE location_tags ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour location_tags
CREATE POLICY "Users can view own location_tags" ON location_tags
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own location_tags" ON location_tags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own location_tags" ON location_tags
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own location_tags" ON location_tags
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_location_tags_user_id ON location_tags(user_id);

-- Créer la table user_profiles pour les préférences utilisateur
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  pseudo VARCHAR(50),
  avatar_emoji VARCHAR(10) DEFAULT '💩',
  accent_color VARCHAR(20) DEFAULT 'amber',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security (RLS) pour user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_profiles
CREATE POLICY "Anyone can view all profiles" ON user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Créer la table user_trophies pour les trophées débloqués
CREATE TABLE user_trophies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trophy_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, trophy_id)
);

-- Activer Row Level Security (RLS) pour user_trophies
ALTER TABLE user_trophies ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_trophies
CREATE POLICY "Anyone can view all trophies" ON user_trophies
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own trophies" ON user_trophies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_trophies_user_id ON user_trophies(user_id);
CREATE INDEX idx_user_trophies_trophy_id ON user_trophies(trophy_id);

/*
  # Early Prediction of Lifestyle Diseases - Database Schema

  ## Overview
  Complete database schema for health prediction and monitoring system

  ## New Tables
  
  ### 1. `user_profiles`
  Extended user information
  - `id` (uuid, primary key) - references auth.users
  - `full_name` (text) - user's full name
  - `email` (text) - user's email
  - `age` (integer) - user's age
  - `gender` (text) - user's gender
  - `height` (numeric) - height in cm
  - `weight` (numeric) - weight in kg
  - `is_admin` (boolean) - admin flag
  - `created_at` (timestamptz) - creation timestamp
  - `updated_at` (timestamptz) - last update timestamp

  ### 2. `health_assessments`
  Complete health assessment records
  - `id` (uuid, primary key)
  - `user_id` (uuid) - references user_profiles
  - `assessment_type` (text) - type of assessment
  - `glucose_level` (numeric) - blood glucose
  - `blood_pressure_systolic` (integer) - systolic BP
  - `blood_pressure_diastolic` (integer) - diastolic BP
  - `cholesterol` (numeric) - cholesterol level
  - `bmi` (numeric) - body mass index
  - `heart_rate` (integer) - resting heart rate
  - `exercise_hours` (numeric) - weekly exercise hours
  - `smoking` (boolean) - smoking status
  - `alcohol_consumption` (text) - alcohol frequency
  - `family_history` (boolean) - family disease history
  - `stress_level` (integer) - stress level 1-10
  - `sleep_hours` (numeric) - average sleep hours
  - `created_at` (timestamptz) - assessment timestamp

  ### 3. `predictions`
  Disease risk predictions with confidence scores
  - `id` (uuid, primary key)
  - `assessment_id` (uuid) - references health_assessments
  - `user_id` (uuid) - references user_profiles
  - `disease_type` (text) - disease category
  - `risk_level` (text) - low/medium/high
  - `confidence_score` (numeric) - prediction confidence
  - `risk_factors` (jsonb) - detailed risk factors
  - `created_at` (timestamptz) - prediction timestamp

  ### 4. `recommendations`
  Personalized health recommendations
  - `id` (uuid, primary key)
  - `prediction_id` (uuid) - references predictions
  - `user_id` (uuid) - references user_profiles
  - `fitness_plan` (jsonb) - exercise recommendations
  - `diet_plan` (jsonb) - nutrition recommendations
  - `lifestyle_modifications` (jsonb) - lifestyle changes
  - `sleep_recommendations` (jsonb) - sleep improvements
  - `stress_management` (jsonb) - stress reduction tips
  - `weekly_schedule` (jsonb) - 7-day structured plan
  - `created_at` (timestamptz) - creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Admins can access all data for analytics
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  age integer NOT NULL CHECK (age >= 0 AND age <= 120),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height numeric NOT NULL CHECK (height > 0),
  weight numeric NOT NULL CHECK (weight > 0),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_assessments table
CREATE TABLE IF NOT EXISTS health_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assessment_type text NOT NULL,
  glucose_level numeric,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  cholesterol numeric,
  bmi numeric,
  heart_rate integer,
  exercise_hours numeric DEFAULT 0,
  smoking boolean DEFAULT false,
  alcohol_consumption text DEFAULT 'none',
  family_history boolean DEFAULT false,
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_hours numeric,
  created_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES health_assessments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  disease_type text NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  confidence_score numeric NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  risk_factors jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id uuid NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  fitness_plan jsonb DEFAULT '{}'::jsonb,
  diet_plan jsonb DEFAULT '{}'::jsonb,
  lifestyle_modifications jsonb DEFAULT '[]'::jsonb,
  sleep_recommendations jsonb DEFAULT '{}'::jsonb,
  stress_management jsonb DEFAULT '{}'::jsonb,
  weekly_schedule jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for health_assessments
CREATE POLICY "Users can view own assessments"
  ON health_assessments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON health_assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all assessments"
  ON health_assessments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for predictions
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for recommendations
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_assessments_user_id ON health_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_assessment_id ON predictions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_prediction_id ON recommendations(prediction_id);
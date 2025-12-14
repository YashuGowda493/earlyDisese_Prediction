/*
  # Optimize RLS Policies and Security

  ## Changes
  1. Drop and recreate RLS policies with optimized auth.uid() calls wrapped in SELECT
  2. Remove unused indexes
  3. Improve query performance at scale

  This resolves Supabase security warnings about inefficient RLS policy evaluation.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own assessments" ON health_assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON health_assessments;
DROP POLICY IF EXISTS "Admins can view all assessments" ON health_assessments;

DROP POLICY IF EXISTS "Users can view own predictions" ON predictions;
DROP POLICY IF EXISTS "Users can insert own predictions" ON predictions;
DROP POLICY IF EXISTS "Admins can view all predictions" ON predictions;

DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
DROP POLICY IF EXISTS "Users can insert own recommendations" ON recommendations;
DROP POLICY IF EXISTS "Admins can view all recommendations" ON recommendations;

-- Recreate user_profiles policies with optimized auth.uid()
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- Recreate health_assessments policies with optimized auth.uid()
CREATE POLICY "Users can view own assessments"
  ON health_assessments FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own assessments"
  ON health_assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can view all assessments"
  ON health_assessments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- Recreate predictions policies with optimized auth.uid()
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can view all predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- Recreate recommendations policies with optimized auth.uid()
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can view all recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- Remove unused indexes
DROP INDEX IF EXISTS idx_health_assessments_user_id;
DROP INDEX IF EXISTS idx_predictions_user_id;
DROP INDEX IF EXISTS idx_predictions_assessment_id;
DROP INDEX IF EXISTS idx_recommendations_user_id;
DROP INDEX IF EXISTS idx_recommendations_prediction_id;
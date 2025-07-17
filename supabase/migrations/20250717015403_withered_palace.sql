/*
  # Create users and API keys tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key) 
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `user_api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `encrypted_api_key` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add encryption/decryption functions for API keys
*/

-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_api_keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  encrypted_api_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint to ensure one API key per user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_api_keys_user_id_key'
  ) THEN
    ALTER TABLE user_api_keys ADD CONSTRAINT user_api_keys_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for user_api_keys table
CREATE POLICY "Users can manage their own API keys"
  ON user_api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create encryption/decryption functions
CREATE OR REPLACE FUNCTION encrypt_api_key(api_key text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(api_key, encryption_key), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(decode(encrypted_key, 'base64'), encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
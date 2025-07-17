/*
  # Create API Keys Storage Table

  1. New Tables
    - `user_api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `encrypted_api_key` (text, encrypted OpenAI API key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_api_keys` table
    - Add policy for users to manage their own API keys
    - API keys are encrypted before storage

  3. Functions
    - Helper functions for encryption/decryption
*/

-- Create extension for encryption if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create user_api_keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  encrypted_api_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own API keys"
  ON user_api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to encrypt API key
CREATE OR REPLACE FUNCTION encrypt_api_key(api_key text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(api_key, encryption_key),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrypt API key
CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_key, 'base64'),
    encryption_key
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
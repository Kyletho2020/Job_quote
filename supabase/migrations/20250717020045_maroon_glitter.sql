/*
  # Direct API Key Storage

  1. New Tables
    - `stored_api_key`
      - `id` (uuid, primary key)
      - `encrypted_key` (text, encrypted API key)
      - `created_at` (timestamp)

  2. Security
    - Simple table without RLS for direct storage
    - Uses encryption for API key protection
*/

-- Create extension for encryption if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table for storing the API key
CREATE TABLE IF NOT EXISTS stored_api_key (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Encryption/Decryption functions
CREATE OR REPLACE FUNCTION encrypt_api_key(api_key text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN encode(encrypt(api_key::bytea, encryption_key, 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN convert_from(decrypt(decode(encrypted_key, 'base64'), encryption_key, 'aes'), 'UTF8');
END;
$$ LANGUAGE plpgsql;
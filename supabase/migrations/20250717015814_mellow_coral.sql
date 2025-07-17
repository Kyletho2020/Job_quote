/*
  # Simple API Key Storage

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `encrypted_key` (text)
      - `created_at` (timestamp)

  2. Security
    - No RLS needed for this simple approach
    - Keys are encrypted before storage
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create encryption/decryption functions
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
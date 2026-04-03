// fix_storage_rls.mjs — Fixes the "new row violates row-level security policy" on image upload
// This sets up the 'products' storage bucket and its RLS policies.

import pg from 'pg';
const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL ||
  'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

const SQL = `
-- 1. Ensure the products bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies on storage.objects for clean setup
DROP POLICY IF EXISTS "Give public access to products" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload products" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update products" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete products" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

-- 3. Create new RLS policies for the products bucket

-- Anyone can view the images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Only admins can upload new images
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND 
  auth.role() = 'authenticated' AND
  public.get_my_role() = 'admin'
);

-- Only admins can update images
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products' AND 
  auth.role() = 'authenticated' AND
  public.get_my_role() = 'admin'
);

-- Only admins can delete images
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' AND 
  auth.role() = 'authenticated' AND
  public.get_my_role() = 'admin'
);

-- 4. Grant necessary permissions (just in case)
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT ON storage.buckets TO anon;
`;

async function main() {
  console.log('🔧 Connecting to Supabase to fix Storage RLS...');
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected!');
    console.log('🛠️  Creating bucket and applying storage policies...');
    await client.query(SQL);
    console.log('');
    console.log('✅ Done! Storage RLS policies fixed.');
    console.log('');
    console.log('🎉 Go back to http://localhost:5173/admin/products and try adding a product WITH an image now!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();

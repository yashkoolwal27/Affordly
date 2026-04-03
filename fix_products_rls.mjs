// fix_products_rls.mjs — Fixes the "new row violates row-level security policy" on products table
// Root cause: get_my_role() function lacks EXECUTE grant for authenticated Supabase users

import pg from 'pg';
const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL ||
  'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

const SQL = `
-- Step 1: Grant EXECUTE on the helper function to Supabase roles
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO anon;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO service_role;

-- Step 2: Recreate the function explicitly with SECURITY DEFINER + search_path locked
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Re-grant after recreating
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO anon;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO service_role;

-- Step 3: Drop and recreate all products policies cleanly
DROP POLICY IF EXISTS "Everyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Everyone can read products (no auth needed)
CREATE POLICY "Everyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.get_my_role() = 'admin');

-- Only admins can update
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- Only admins can delete
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.get_my_role() = 'admin');

-- Step 4: Also grant table-level permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;
`;

async function main() {
  console.log('🔧 Connecting to Supabase...');
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected!');
    console.log('🛠️  Fixing products RLS and granting permissions...');
    await client.query(SQL);
    console.log('');
    console.log('✅ Done! Products RLS policies fixed.');
    console.log('');
    console.log('🎉 Go back to http://localhost:5173/admin/products and try adding a product again!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();

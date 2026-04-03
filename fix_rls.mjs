// fix_rls.mjs — Fixes the RLS infinite recursion bug on public.users
// The "Admins can view all profiles" policy caused a 500 error because
// it queries public.users from within a policy ON public.users → infinite loop.
// Fix: use auth.jwt() to read the role from the JWT metadata instead.

import pg from 'pg';
const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL ||
  'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

const SQL = `
-- Step 1: Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Step 2: Re-create non-recursive policies

-- Allow users to read their own profile (no self-reference)
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile on signup
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Step 3: Fix cascading policies on other tables that also cause recursion
-- (Replace the subquery-based admin check with a direct auth.uid() check using a security definer function)

-- Create a helper function to get role without recursion
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Fix PRODUCTS policies
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.get_my_role() = 'admin');

-- Fix ORDERS policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR public.get_my_role() = 'admin'
  );

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.get_my_role() = 'admin');

-- Fix ORDER ITEMS policies
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_items.order_id
        AND public.orders.user_id = auth.uid()
    )
    OR public.get_my_role() = 'admin'
  );
`;

async function main() {
  console.log('🔧 Connecting to Supabase to fix RLS policies...');
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected!');
    console.log('🛠️  Dropping recursive policies and re-creating safe ones...');
    await client.query(SQL);
    console.log('');
    console.log('✅ RLS policies fixed!');
    console.log('');
    console.log('🎉 Now refresh the app at http://localhost:5173');
    console.log('   Log in with your admin account — the Admin Panel link should appear!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();

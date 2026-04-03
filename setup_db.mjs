
// setup_db.mjs - Run this once to initialize NeonKart's Supabase database
// Usage: node setup_db.mjs

import pg from 'pg';
const { Client } = pg;

// Read password from env or hardcode here for one-time setup
// The connection string format from Supabase: postgresql://postgres:[PASSWORD]@db.[ref].supabase.co:5432/postgres
const DB_URL = process.env.SUPABASE_DB_URL || 'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

const SQL = `
-- ==========================================================
-- 1. Create Tables
-- ==========================================================

-- USERS Table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'customer'::text CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('watches', 'fabrics', 'shoes')),
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  total_price numeric(10, 2) NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamptz DEFAULT now()
);

-- ORDER ITEMS Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==========================================================
-- 2. Decrement Stock RPC
-- ==========================================================
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - quantity
  WHERE id = product_id AND stock >= quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$;

-- ==========================================================
-- 3. Enable Row Level Security (RLS)
-- ==========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 4. Create Security Policies (IF NOT EXISTS)
-- ==========================================================

-- USERS Table Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='Admins can view all profiles') THEN
    CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='users' AND policyname='Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- PRODUCTS Table Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Everyone can view products') THEN
    CREATE POLICY "Everyone can view products" ON public.products FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Admins can insert products') THEN
    CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Admins can update products') THEN
    CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Admins can delete products') THEN
    CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- ORDERS Table Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Customers can view their orders') THEN
    CREATE POLICY "Customers can view their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Customers can create orders') THEN
    CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Admins can view all orders') THEN
    CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Admins can update orders') THEN
    CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- ORDER ITEMS Table Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='order_items' AND policyname='Users can view own order items') THEN
    CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='order_items' AND policyname='Users can create order items') THEN
    CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='order_items' AND policyname='Admins can view all order items') THEN
    CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;
`;

async function main() {
  console.log('🚀 Connecting to Supabase database...');
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('✅ Connected!');

    console.log('📦 Running SQL setup script...');
    await client.query(SQL);
    console.log('✅ All tables, RLS policies, and functions created successfully!');
    console.log('');
    console.log('🎉 NeonKart database is ready!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Sign up at http://localhost:5173/auth');
    console.log('  2. Go to Supabase Table Editor → users table');
    console.log('  3. Set your user role to "admin"');
    console.log('  4. Go to /admin to add products!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.message.includes('password')) {
      console.log('');
      console.log('💡 Hint: Your DB password may contain special characters.');
      console.log('   Update the DB_URL variable in this script with the correct password.');
    }
  } finally {
    await client.end();
  }
}

main();

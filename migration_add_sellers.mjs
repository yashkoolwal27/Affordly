import pg from 'pg';
const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL || 'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

const SQL = `
-- 1. Alter public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS seller_category text;

-- Replace role constraint dynamically
DO $$ 
DECLARE
  c_name text;
BEGIN
  SELECT conname INTO c_name
  FROM pg_constraint
  WHERE conrelid = 'public.users'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%role%';
  
  IF c_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.users DROP CONSTRAINT ' || c_name;
  END IF;
  
  ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'admin', 'seller'));
END $$;


-- 2. Alter public.products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.users(id) ON DELETE CASCADE;

-- Replace category constraint dynamically
DO $$ 
DECLARE
  c_name text;
BEGIN
  SELECT conname INTO c_name
  FROM pg_constraint
  WHERE conrelid = 'public.products'::regclass AND contype = 'c' AND (pg_get_constraintdef(oid) LIKE '%category%' OR pg_get_constraintdef(oid) LIKE '%shoes%');
  
  IF c_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.products DROP CONSTRAINT ' || c_name;
  END IF;

  ALTER TABLE public.products ADD CONSTRAINT products_category_check CHECK (category IN ('watches', 'fabrics', 'shoes', 'corsets'));
END $$;

-- 3. RLS - Products
DROP POLICY IF EXISTS "Sellers can insert own products" ON public.products;
CREATE POLICY "Sellers can insert own products" ON public.products
  FOR INSERT WITH CHECK (
    public.get_my_role() = 'seller' 
    AND auth.uid() = seller_id
  );

DROP POLICY IF EXISTS "Sellers can update own products" ON public.products;
CREATE POLICY "Sellers can update own products" ON public.products
  FOR UPDATE USING (
    public.get_my_role() = 'seller' 
    AND auth.uid() = seller_id
  );

DROP POLICY IF EXISTS "Sellers can delete own products" ON public.products;
CREATE POLICY "Sellers can delete own products" ON public.products
  FOR DELETE USING (
    public.get_my_role() = 'seller'
    AND auth.uid() = seller_id
  );

-- 4. RLS - Order Items
DROP POLICY IF EXISTS "Sellers can view own order items" ON public.order_items;
CREATE POLICY "Sellers can view own order items" ON public.order_items
  FOR SELECT USING (
    public.get_my_role() = 'seller'
    AND EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = order_items.product_id
      AND products.seller_id = auth.uid()
    )
  );

-- 5. RLS - Orders
DROP POLICY IF EXISTS "Sellers can view related orders" ON public.orders;
CREATE POLICY "Sellers can view related orders" ON public.orders
  FOR SELECT USING (
    public.get_my_role() = 'seller'
    AND EXISTS (
      SELECT 1 FROM public.order_items
      JOIN public.products ON order_items.product_id = products.id
      WHERE products.seller_id = auth.uid()
      AND order_items.order_id = orders.id
    )
  );

`;

async function main() {
  console.log('🚀 Connecting to Supabase...');
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('✅ Connected!');
    console.log('📦 Applying migration for Multi-Vendor Sellers...');
    await client.query(SQL);
    console.log('✅ Seller migration applied successfully!');
  } catch (err) {
    console.error('❌ Error applying migration:', err);
  } finally {
    await client.end();
  }
}

main();

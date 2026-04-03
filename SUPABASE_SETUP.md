# NeonKart Supabase Setup Guide

This guide will walk you through setting up the Supabase database, authentication, and storage for NeonKart.

## 1. Create a Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and select an organization.
3. Enter a project name (e.g., `neonkart`) and a strong database password.
4. Wait for the project to provision.
5. In your project dashboard, go to **Project Settings -> API** to copy your `Project URL` and `anon public key`.
6. Add these to your `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## 2. Authentication Setup
1. In the Supabase dashboard, go to **Authentication -> Providers**.
2. "Email" is enabled by default. Ensure "Confirm email" is turned **off** for easier local testing (optional, but recommended for development).

## 3. Storage Setup
1. Go to **Storage**.
2. Click **New Bucket**.
3. Name it `products`.
4. Make the bucket **Public**.
5. Click **Save**.
6. Select the `products` bucket, go to the **Policies** tab.
7. Click **New Policy -> For Full Customization**.
   - Create a policy for **SELECT** operations: `true` (so everyone can see images).
   - Create a policy for **INSERT**, **UPDATE**, and **DELETE** where `(auth.uid() in (select id from public.users where role = 'admin'))` (only admins can upload/delete images).

## 4. Run the SQL Script
1. Go to **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Paste the following SQL script exactly as is and click **Run**.

```sql
-- ==========================================================
-- 1. Create Tables
-- ==========================================================

-- USERS Table (extends Supabase Auth)
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'customer'::text CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- PRODUCTS Table
CREATE TABLE public.products (
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
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  total_price numeric(10, 2) NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamptz DEFAULT now()
);

-- ORDER ITEMS Table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==========================================================
-- 2. Decrement Stock RPC (Remote Procedure Call)
-- ==========================================================
-- Used securely to reduce stock during checkout to prevent race conditions

CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- We subtract the given quantity from the current stock
  UPDATE public.products
  SET stock = stock - quantity
  WHERE id = product_id AND stock >= quantity;

  -- If no rows were changed, it implies insufficient stock or invalid product
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
-- 4. Create Security Policies
-- ==========================================================

-- ---- USERS Table Policies ----
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
-- Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);


-- ---- PRODUCTS Table Policies ----
-- Everyone can read products
CREATE POLICY "Everyone can view products" ON public.products FOR SELECT USING (true);
-- Only admins can insert, update, or delete products
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);


-- ---- ORDERS Table Policies ----
-- Customers can view their own orders
CREATE POLICY "Customers can view their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
-- Customers can insert their own orders
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
-- Admins can update order status
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);


-- ---- ORDER ITEMS Table Policies ----
-- Users can view their own order items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
);
-- Users can insert order items
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
);
-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
```

## 5. Promote a User to Admin
Because user creation defaults to the `'customer'` role, you must perform this manual step to test the admin dashboard.

1. Create an account via the frontend app by signing up (e.g. `admin@example.com`).
2. Go to your Supabase dashboard -> **Table Editor** -> `users` table.
3. Find your user row, double click the `role` cell.
4. Change `'customer'` to `'admin'` and hit Save (Enter).
5. Refresh the web app. Your user profile menu should now display the "Admin Panel" link.

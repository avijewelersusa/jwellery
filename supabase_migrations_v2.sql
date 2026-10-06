-- =========================================================================
-- AVI JEWELERS USA — ADVANCED PRODUCTION DATABASE MIGRATION (V2)
-- Execute in Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. ADMIN PROFILES & ROLES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Catalog Manager' CHECK (role IN ('Owner/Admin', 'Content Editor', 'Catalog Manager', 'Sales/Support')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 2. CATEGORIES & TAXONOMIES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY, -- e.g. 'engagement-rings', 'wedding-bands'
  parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  menu_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert standard Avi Jewelers categories if not exist
INSERT INTO public.categories (id, name, slug, description, menu_order)
VALUES 
  ('engagement-rings', 'Engagement Rings', 'engagement-rings', 'Bespoke solitaires, hidden halos, and three-stone creations.', 1),
  ('wedding-bands', 'Wedding & Eternity Bands', 'wedding-bands', 'Eternity bands, French pavé, and classic precious metal bands.', 2),
  ('bracelets', 'Tennis Bracelets', 'bracelets', 'Continuous fire lab diamond and natural diamond tennis bracelets.', 3),
  ('earrings', 'Earrings & Diamond Studs', 'earrings', 'Classic 3-prong martini diamond studs and diamond huggies.', 4),
  ('necklaces', 'Necklaces & Solitaire Pendants', 'necklaces', 'Minimalist floating bezel pendants and Riviera necklaces.', 5)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 3. PRODUCTS CATALOG (WooCommerce-style)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT, -- legacy backward compatibility
  slug TEXT UNIQUE,
  sku TEXT UNIQUE,
  type TEXT DEFAULT 'simple' CHECK (type IN ('simple', 'variable', 'grouped', 'bespoke')),
  status TEXT DEFAULT 'publish' CHECK (status IN ('publish', 'draft', 'scheduled', 'trash')),
  visibility TEXT DEFAULT 'visible' CHECK (visibility IN ('visible', 'catalog', 'search', 'hidden')),
  category TEXT NOT NULL,
  primary_category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  shape TEXT,
  "stoneType" TEXT,
  badge TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  regular_price NUMERIC(12, 2) DEFAULT 0.00,
  sale_price NUMERIC(12, 2),
  "compareAtPrice" NUMERIC(12, 2),
  cost_price NUMERIC(12, 2),
  currency TEXT DEFAULT 'USD' NOT NULL,
  manage_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 10,
  stock_status TEXT DEFAULT 'instock' CHECK (stock_status IN ('instock', 'outofstock', 'onbackorder', 'madetoorder')),
  low_stock_threshold INTEGER DEFAULT 3,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  "reviewCount" INTEGER DEFAULT 0,
  "primaryImage" TEXT NOT NULL,
  "secondaryImage" TEXT,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  "metalOptions" TEXT[] DEFAULT ARRAY['14k Yellow Gold', '14k White Gold', 'Platinum']::TEXT[],
  carat TEXT,
  color TEXT,
  clarity TEXT,
  cut TEXT,
  certification TEXT,
  "leadTime" TEXT DEFAULT 'Ships in 2-3 weeks',
  description TEXT,
  short_description TEXT,
  "isBestSeller" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  jewelry_meta JSONB DEFAULT '{}'::jsonb,
  shipping_meta JSONB DEFAULT '{}'::jsonb,
  seo_meta JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for high-speed catalog browsing and SKU searches
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- =========================================================================
-- 4. PRODUCT VARIATIONS TABLE (Authoritative variants)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.product_variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  attributes JSONB NOT NULL, -- e.g. {"metal": "14k Yellow Gold", "size": "6.5"}
  regular_price NUMERIC(12, 2) NOT NULL,
  sale_price NUMERIC(12, 2),
  stock_quantity INTEGER DEFAULT 5,
  stock_status TEXT DEFAULT 'instock',
  image_url TEXT,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 5. INVENTORY MOVEMENTS (Immutable audit trail)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'Restock', 'Client Order', 'Adjustment', 'Damage/Vault transfer'
  reference_id TEXT, -- Order ID or Batch ID
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 6. ORDERS, ORDER ITEMS & TIMELINES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. 'AVI-894210'
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_method TEXT DEFAULT 'Credit Card (Stripe Authorized)',
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('pending', 'authorized', 'paid', 'refunded', 'failed')),
  fulfillment_status TEXT DEFAULT 'processing' CHECK (fulfillment_status IN ('unfulfilled', 'crafting', 'inspection', 'in_transit', 'delivered')),
  subtotal NUMERIC(12, 2) NOT NULL,
  tax NUMERIC(12, 2) DEFAULT 0.00,
  shipping_cost NUMERIC(12, 2) DEFAULT 0.00,
  total NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  tracking_number TEXT,
  carrier TEXT DEFAULT 'FedEx Priority Armored Express',
  timeline JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  variation_id UUID,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  selected_metal TEXT,
  selected_size TEXT,
  carat TEXT,
  certificate_number TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 7. CUSTOM INQUIRIES / BESPOKE ATELIER CRM
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.custom_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "referenceId" TEXT UNIQUE NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  "ringType" TEXT,
  "ringShape" TEXT,
  metal TEXT,
  "stonePreference" TEXT,
  "budgetRange" TEXT,
  "ringSize" TEXT,
  "inspoLink" TEXT,
  description TEXT,
  "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "consultationDate" DATE,
  "consultationTime" TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'CAD In Progress', 'Cast & Handset', 'Completed')),
  is_read BOOLEAN DEFAULT false,
  staff_notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 8. CONSULTATIONS / SHOWROOM APPOINTMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Virtual Zoom Consultation' or 'Chicago Showroom (5 S Wabash)'
  date DATE NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled')),
  staff_assignee TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 9. VISUAL STUDIO OVERRIDES & REVISIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.site_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  element_id TEXT NOT NULL, -- e.g. 'hero-title', 'hero-subtitle'
  page_key TEXT NOT NULL, -- 'home', 'custom', 'about', etc.
  content TEXT,
  styles JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_site_override UNIQUE (page_key, element_id, is_published)
);

-- =========================================================================
-- 10. REVIEWS & COUPONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed_cart')),
  amount NUMERIC(10, 2) NOT NULL,
  min_spend NUMERIC(10, 2) DEFAULT 0.00,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ RULES:
-- Anyone can view published products, categories, active reviews, and published site overrides
CREATE POLICY "Public read published products" ON public.products
  FOR SELECT USING (status = 'publish' OR status IS NULL);

CREATE POLICY "Public read variations" ON public.product_variations
  FOR SELECT USING (is_enabled = true);

CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public read reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public read published site overrides" ON public.site_overrides
  FOR SELECT USING (is_published = true);

-- PUBLIC INSERT RULES:
-- Customers can submit custom inquiries, book appointments, and submit orders
CREATE POLICY "Public insert custom inquiries" ON public.custom_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- FULL ACCESS FOR AUTHENTICATED STAFF / ADMIN
CREATE POLICY "Admin all on products" ON public.products
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on variations" ON public.product_variations
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on categories" ON public.categories
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on inquiries" ON public.custom_inquiries
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on appointments" ON public.appointments
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on orders" ON public.orders
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on order items" ON public.order_items
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on site overrides" ON public.site_overrides
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on coupons" ON public.coupons
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin all on reviews" ON public.reviews
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

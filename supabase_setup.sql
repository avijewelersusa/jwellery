-- =========================================================================
-- AVI JEWELERS — SUPABASE SETUP (matches the storefront + /admin code)
-- Safe to re-run. Paste into Supabase → SQL Editor → Run.
-- Any field the app sends that has no column here is kept in `extra` (jsonb)
-- by the client code, so new form fields never break inserts.
-- =========================================================================

-- 1. PRODUCTS (public catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  category TEXT,
  shape TEXT,
  "stoneType" TEXT,
  badge TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  "compareAtPrice" NUMERIC(12, 2),
  rating NUMERIC(3, 1) DEFAULT 5.0,
  "reviewCount" INTEGER DEFAULT 0,
  "primaryImage" TEXT,
  "secondaryImage" TEXT,
  "metalOptions" TEXT[],
  carat TEXT,
  color TEXT,
  clarity TEXT,
  cut TEXT,
  certification TEXT,
  "leadTime" TEXT,
  description TEXT,
  "isBestSeller" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 10,
  currency TEXT DEFAULT 'USD',
  extra JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. CUSTOM RING INQUIRIES (Design Your Ring form)
CREATE TABLE IF NOT EXISTS public.custom_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "referenceId" TEXT UNIQUE NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  email TEXT,
  phone TEXT,
  "ringType" TEXT,
  "ringShape" TEXT,
  metal TEXT,
  "stonePreference" TEXT,
  "budgetRange" TEXT,
  "ringSize" TEXT,
  "inspoLink" TEXT,
  description TEXT,
  "imageUrls" TEXT[],
  "consultationType" TEXT,
  "consultationDate" TEXT,
  "consultationTime" TEXT,
  status TEXT DEFAULT 'New',
  extra JSONB DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. CONSULTATION APPOINTMENTS (Contact page)
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  "fullName" TEXT,
  email TEXT,
  phone TEXT,
  type TEXT,
  date TEXT,
  time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  extra JSONB DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. ORDERS + LINE ITEMS (Checkout)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'paid',
  fulfillment_status TEXT DEFAULT 'crafting',
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax NUMERIC(12, 2) DEFAULT 0,
  shipping_cost NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  tracking_number TEXT,
  carrier TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  extra JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  name TEXT,
  price NUMERIC(12, 2) DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  selected_metal TEXT,
  selected_size TEXT,
  carat TEXT,
  certificate_number TEXT,
  image_url TEXT,
  extra JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. VISUAL EDITOR OVERRIDES (/admin Visual Studio "Publish")
CREATE TABLE IF NOT EXISTS public.site_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  element_id TEXT NOT NULL,
  page_key TEXT NOT NULL,
  content TEXT,
  styles JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT true,
  extra JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (page_key, element_id)
);

-- 6. KEEP-ALIVE heartbeat (written once a day by the Vercel cron in /api/keep-alive)
CREATE TABLE IF NOT EXISTS public.keep_alive (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_ping TIMESTAMPTZ DEFAULT now() NOT NULL,
  source TEXT
);
INSERT INTO public.keep_alive (id, source) VALUES (1, 'setup') ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- ROW LEVEL SECURITY
-- Catalog tables (products, site_overrides, keep_alive): public read + anon
-- write, because the PIN-protected /admin panel uses the public key.
-- Customer tables (inquiries, appointments, orders): the public can only
-- INSERT. Reading/updating them needs a signed-in Supabase user, so customer
-- names, emails, phones and addresses are never readable with the public key.
-- =========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keep_alive ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['products','site_overrides','keep_alive'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "avi_anon_all" ON public.%I', t);
    EXECUTE format('CREATE POLICY "avi_anon_all" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['custom_inquiries','appointments','orders','order_items'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "avi_public_insert" ON public.%I', t);
    EXECUTE format('CREATE POLICY "avi_public_insert" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', t);
    EXECUTE format('DROP POLICY IF EXISTS "avi_staff_all" ON public.%I', t);
    EXECUTE format('CREATE POLICY "avi_staff_all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

NOTIFY pgrst, 'reload schema';

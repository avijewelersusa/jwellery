-- =========================================================================
-- AVI JEWELERS — COMPATIBILITY PATCH for the existing v2 database
-- The live project already has the v2 schema (supabase_migrations_v2.sql).
-- This lines it up with what the storefront and /admin actually send.
-- Safe to re-run.
-- =========================================================================

-- Overflow column for any form field that has no dedicated column
ALTER TABLE public.products         ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.custom_inquiries ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.appointments     ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders           ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.order_items      ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_overrides   ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'::jsonb;

-- Custom ring form: consultation type + free-text date ('' or 'Earliest Available')
ALTER TABLE public.custom_inquiries ADD COLUMN IF NOT EXISTS "consultationType" TEXT;
ALTER TABLE public.custom_inquiries ALTER COLUMN "consultationDate" TYPE TEXT USING "consultationDate"::text;
ALTER TABLE public.custom_inquiries ALTER COLUMN "firstName" DROP NOT NULL;
ALTER TABLE public.custom_inquiries ALTER COLUMN "lastName" DROP NOT NULL;

-- Contact page appointments: date can be 'Earliest Available'
ALTER TABLE public.appointments ALTER COLUMN date TYPE TEXT USING date::text;
ALTER TABLE public.appointments ALTER COLUMN phone DROP NOT NULL;

-- v2 default 'processing' violates its own CHECK; use a valid default
ALTER TABLE public.orders ALTER COLUMN fulfillment_status SET DEFAULT 'crafting';

-- Catalog default metals now 18k + Platinum
ALTER TABLE public.products ALTER COLUMN "metalOptions" SET DEFAULT ARRAY['18k White Gold', '18k Yellow Gold', '18k Rose Gold', 'Platinum']::TEXT[];

NOTIFY pgrst, 'reload schema';

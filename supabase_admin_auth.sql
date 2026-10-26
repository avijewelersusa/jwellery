-- =========================================================================
-- AVI JEWELERS — ADMIN-ONLY ACCESS (run after supabase_compat_v2.sql)
-- Customer data (inquiries, appointments, orders) can be created by anyone
-- from the website, but only admins listed in public.admin_roles can read,
-- edit or delete it. Catalog edits are admin-only too; the public can read.
-- Safe to re-run.
-- =========================================================================

-- Is the signed-in user an admin? (email listed in public.admin_roles)
CREATE OR REPLACE FUNCTION public.is_avi_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_avi_admin() TO anon, authenticated;

-- admin_roles itself is never readable/writable from the browser
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
  p RECORD;
BEGIN
  -- Start clean on the tables we govern (drops the old wide-open v2 policies)
  FOR p IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('products','site_overrides','custom_inquiries','appointments','orders','order_items','admin_roles')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;

  -- Catalog: everyone reads, admins write
  FOREACH t IN ARRAY ARRAY['products','site_overrides'] LOOP
    EXECUTE format('CREATE POLICY "avi_public_read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "avi_admin_write" ON public.%I FOR ALL TO authenticated USING (public.is_avi_admin()) WITH CHECK (public.is_avi_admin())', t);
  END LOOP;

  -- Customer data: website can insert, only admins can see/change it
  FOREACH t IN ARRAY ARRAY['custom_inquiries','appointments','orders','order_items'] LOOP
    EXECUTE format('CREATE POLICY "avi_public_insert" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true)', t);
    EXECUTE format('CREATE POLICY "avi_admin_all" ON public.%I FOR ALL TO authenticated USING (public.is_avi_admin()) WITH CHECK (public.is_avi_admin())', t);
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';

-- To add an admin: create the user in Authentication → Users, then run:
--   INSERT INTO public.admin_roles (email, role) VALUES ('person@example.com', 'Owner/Admin')
--   ON CONFLICT (email) DO NOTHING;

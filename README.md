# Avi Jewelers USA — Luxury Bespoke Fine Jewelry Atelier (Chicago, IL)

A luxury, conversion-focused web application for **Avi Jewelers USA**, a Chicago-based custom fine jewelry atelier specializing in bespoke custom engagement rings (3–4 week turnaround, 3D CAD modeling, virtual consultations, insured doorstep delivery) and ready-to-ship certified lab-grown diamond and natural diamond fine jewelry.

---

## 💎 Brand Identity & Visual Language
- **Color Palette**: Warm Ivory (`#FAF7F2`) background, deep charcoal (`#1C1C1C`) typography, champagne gold accent (`#B8975A`), warm cream surfaces (`#F6F2EC`), and soft grey borders (`#E8E4DC`).
- **Typography**: Cormorant Garamond & Playfair Display (editorial serif headings) paired with Inter (modern clean sans body).
- **Aesthetic**: Clean, airy, editorial, trustworthy, and calm. Micro-interactions and subtle gold glows.

---

## 🏛️ Sections & Features

### 1. Navigation & Header
- **Slim Announcement Top Bar**: "Custom designs delivered in 3–4 weeks • Free virtual consultation" with direct phone link: `331-707-2976`.
- **Main Nav**: Custom Engagement Rings (highlighted gold badge), Engagement Rings with Mega Menu, Wedding Bands, Studs & Earrings, Necklaces, Bracelets, Best Sellers, About, Contact.
- **Mega Menu (Engagement Rings)**:
  - **Shop by Shape**: Round, Oval, Radiant, Pear, Cushion, Princess, Emerald, Marquise, Heart.
  - **Shop by Setting**: Solitaire, Hidden Halo, Classic Halo, Three Stone, Vintage & Bezel.
  - **Stone Selection**: IGI Lab Diamond & GIA Natural Diamond.
  - **Bespoke Concierge Tile**: "Design Exactly What She Wants" (direct custom CTA).
- **Search, Wishlist Drawer, Cart Drawer**, and gold **"Start Your Custom Ring"** action button.

### 2. Homepage Sections (in precise sequence)
1. **Full-Screen Hero**: Cinematic couple & fine jewelry imagery, headline *"Your Vision. Handcrafted in Chicago."*, subline, and dual CTAs: *"Design Your Custom Ring"* and *"Shop Ready-to-Ship"*.
2. **Trust Bar**: 5 trust pillars (IGI Certified Lab-Grown • GIA Certified Natural Diamonds • 3–4 Week Turnaround • Secure Insured Delivery • Virtual Consultations).
3. **How Custom Works (4 Animated Steps)**:
   - `01. Share Your Idea` (upload inspo photos, sketches, or paste web links)
   - `02. Consult & 3D CAD Design` (1-on-1 virtual design session & photorealistic 360° renders)
   - `03. Master Handcrafting` (handset in solid gold/platinum by experienced luxury artisans)
   - `04. Delivered To Your Door` (certificate, appraisal, luxury wooden box, adult signature)
4. **Shop by Shape**: Round image tiles for all 9 shapes with cut proportions and silhouette info.
5. **Custom Showcase**: Interactive Before/After gallery comparing client inspiration photos/sketches to the finished bespoke ring with turnarounds and stories.
6. **Best Sellers Grid (8 Products)**: Dual image hover flip, certification badges, price, quick view modal, and quick add-to-cart.
7. **Shop by Category Tiles**: Engagement Rings, Wedding Bands, Studs & Earrings, Necklaces & Pendants, Bracelets & Bangles.
8. **Split Banner**: *"Can't find it? We'll make it."* with Chicago atelier story and direct custom inquiry CTA.
9. **Why Avi Jewelers**: Certified stones, handcrafted quality in Chicago, transparent pricing, lifetime care, and 0% APR financing.
10. **Client Love Stories**: Verified couple testimonial carousel with photos, ring specifications, and 5-star ratings.
11. **FAQ Accordion**: Expandable answers covering lab vs natural diamonds, timeline, sizing secrets, insured shipping, returns, and payment options.
12. **Instagram Gallery Strip**: `@avijewelersusa` feed simulation with hover like counters.
13. **VIP Newsletter & Luxury Footer**: $100 custom ring offer, Chicago showroom details (`5 S Wabash Ave, Suite 710, Chicago, IL 60603`), hours, policies, and payment icons.

### 3. Custom Design Studio (`/custom`)
- Storytelling hero & craftsmanship ethos.
- 4-step process breakdown.
- Polished multi-step custom inquiry form:
  - Step 1: Setting Architecture (Solitaire, Hidden Halo, Halo, Three-Stone, Vintage, Bezel) & Diamond Cut (9 shapes)
  - Step 2: Precious Metal (14k/18k Yellow, White, Rose Gold, Platinum), Stone Choice, Budget Range, Ring Size
  - Step 3: Web link input, custom description, drag-and-drop multiple image uploader with preview thumbnails
  - Step 4: Contact details & consultation scheduler (Virtual Zoom or Chicago Showroom, date picker, time slot)
  - **Success Screen**: Reference number generation (e.g., `AVI-BESP-892104`), confirmation recap, and automatic sync to Supabase (with persistent fallback).

### 4. Shop & Collection View
- Multi-faceted sidebar filters (Category, Shape, Certification, Price Range, Metal).
- Dynamic sorting (Featured, Price Low/High, Rating).
- Active filter pill tags with 1-click clearing.
- Product Detail / Quick View Modal:
  - High-res image gallery with zoom
  - Metal swatch selector
  - Ring size selector (3.5 to 10.0)
  - Stone specifications breakdown (Carat, Color, Clarity, Cut)
  - IGI / GRA Certification assurance
  - *"Want this customized? Request a custom version"* button (pre-fills the custom form!)
  - Shipping & returns accordion
  - Related product recommendations

### 5. Cart, Wishlist & Checkout
- Slide-out Cart Drawer with item quantity controls and metal details.
- Free FedEx Insured Priority Overnight progress bar.
- Promo code engine (`AVI100` for 10% off).
- Stripe-ready checkout modal with Apple Pay and credit card simulation.
- Wishlist drawer with local persistence.

### 6. Admin Management Suite (`/admin`)
- **Protected Login**: Passcode `avi2026` (or `admin`).
- **Products Catalog**: Add new pieces with image upload URLs, edit existing pieces, toggle Best Seller / Featured badges, and delete.
- **Custom Inquiries Tracker**: Inspect all client submissions from `/custom`, view inspiration links, budget, contact details, and update status (`New`, `Reviewing`, `CAD In Progress`, `Cast & Handset`, `Completed`).
- **Consultations & Appointments**: View booked showroom & Zoom sessions.
- **CSV Bulk Importer**: 1-click sample template for 40–50 items or paste your own CSV data to bulk-import catalog items into Supabase/store inventory!

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```

---

## 🗄️ Supabase Cloud Integration

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and execute the provided `supabase_schema.sql` file.
3. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*Note: If no `.env` is configured, the application automatically runs in persistent local storage mode with full functionality!*

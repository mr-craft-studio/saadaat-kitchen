# Saadaat Kitchen — Premium 3D Restaurant & Online Ordering Platform

> **Brand Tagline:** Good Food ❤️ Happy Mood  
> **Official Hotline & WhatsApp:** +92 371 0238821  
> **Easypaisa Payment Account:** Syeda Iqraa (+92 371 0238821)

---

## 🌟 Executive Overview

**Saadaat Kitchen** is a high-performance, full-stack restaurant website, online food ordering engine, AI customer support assistant, and administrative management dashboard. Built with a bespoke **black-and-gold luxury aesthetic**, subtle 3D food showcase, and cinematic food photography inspired by official Saadaat Kitchen promotional posters.

---

## 🚀 Key Features

### 1. Brand Identity & Visual Design
- **Black & Metallic Gold Theme:** Deep charcoal backdrops (`#09090b`), gold typography gradients, white text, and red promotional badges.
- **Custom 3D Metallic Emblem:** Chef hat brand mark with gold sheen and drop shadows.
- **3D Food Showcase:** Interactive hero card with perspective tilt, charcoal embers, and reduced-motion toggle.
- **High-Fidelity AI Imagery:** Generated commercial restaurant photography for Chicken Malai Tikka, Crispy Zinger Burgers, Paratha Rolls, and Special Momos & Macaroni Combos.

### 2. Complete Menu & Database
All products and prices in Pakistani Rupees (PKR) are pre-loaded in the persistent store:
- **Chicken Tikka & BBQ:** Chicken Tikka Chest (Rs. 500), Tikka Leg (Rs. 500), Malai Tikka (Rs. 600), Bihari Tikka (Rs. 630), Balochi Tikka (Rs. 650), Chicken Boti (Rs. 360), Malai Boti (Rs. 400), Reshmi Kabab (Rs. 350), Beef Bihari Boti (Rs. 380), Beef Seekh Kabab (Rs. 400), Beef Gola Kabab (Rs. 500).
- **Chicken Rolls:** Chicken Roll (Rs. 250), Mayo Roll (Rs. 300), Mayo Garlic Roll (Rs. 310), Cheese Roll (Rs. 350), Cheese Mayo Roll (Rs. 360), Malai Rolls (Rs. 300 - Rs. 370), Reshmi Rolls (Rs. 300 - Rs. 360), Zinger Crispy Rolls (Rs. 350 - Rs. 400).
- **Fried Chicken:** Broast Chest (Rs. 550), Broast Leg (Rs. 520), Mayo Broast Chest (Rs. 580), Mayo Broast Leg (Rs. 550).
- **Burgers:** Zinger Burger (Rs. 400), Zinger Cheese Burger (Rs. 450), Double Decker Zinger (Rs. 680), Chicken Burger (Rs. 380), Chicken Cheese Burger (Rs. 430), Beef Burger (Rs. 400), Beef Cheese Burger (Rs. 450), Sada Burger (Rs. 200), Egg Burger (Rs. 230).
- **Sandwiches:** Club Sandwich (Rs. 400), Club Cheese Sandwich (Rs. 450), BBQ Club Sandwich (Rs. 500), BBQ Malai Club Sandwich (Rs. 550), Crispy Club Sandwich (Rs. 450), Crispy Club Cheese Sandwich (Rs. 550).
- **Fries & Sides:** Fries (Rs. 200), Mayo Fries (Rs. 300).
- **Draft / Unconfirmed Price Protection:** `Chicken Double Burger`, `Beef Burger 650`, and `BBQ Club Cheese Sandwich` are stored safely in draft mode until confirmed by the administrator.

### 3. Shopping Cart & Online Checkout
- Slide-over cart drawer with live badge counter.
- Quantity steppers and custom cooking instructions per item.
- Pakistani mobile number validation (`03xx-xxxxxxx` or `+92 3xx xxxxxxx`).
- Home Delivery (Rs. 100) and Counter Takeaway (Free) fulfillment options.
- Duplicate-click protection with server-side price recalculation.
- Unique order reference generator (e.g. `SK-2026-4821`).

### 4. Dual Payment Methods
- **Cash on Delivery (COD):** Placed as pending, paid upon rider delivery.
- **Easypaisa Online Transfer:** Account Name: **Syeda Iqraa**, Account Number: **+92 371 0238821**. Customers can submit their 11-digit TRX ID during checkout or afterwards via live tracking.

### 5. WhatsApp Integration
- Floating WhatsApp button linking to `https://wa.me/923710238821`.
- Post-checkout **"Send Order Summary via WhatsApp"** button which formats the complete itemized order for instant kitchen coordination.

### 6. AI Customer Support Assistant ("Saadaat Kitchen Assistant")
- Grounded in live menu items and prices.
- Bilingual: English, Urdu, and Roman Urdu.
- Quick action pills: *View Menu*, *Track Order*, *Easypaisa Info*, *Today's Deals*.
- Direct human escalation to WhatsApp at +92 371 0238821.

### 7. Real-Time Order Tracking
- Dedicated `/track-order` portal.
- 6-stage visual timeline: **Received → Confirmed → Cooking & BBQ → Ready for Dispatch → Out for Delivery → Delivered**.
- Easypaisa TRX submission & status verification.

### 8. Private Admin Dashboard (`/admin/login`)
- **Login Credentials:**
  - **Email:** `admin@saadaatkitchen.com`
  - **Password:** `Saadaat@2026`
- **Security Features:**
  - Scrypt password hashing with unique salt
  - 24-hour cryptographically secure session tokens
  - Rate-limit protection: 5 failed attempts locks out the account for 15 minutes
  - All admin endpoints (`/api/admin/*`) require valid Bearer token authorization
- **Dashboard Sections:**
  1. **Overview & Live KPIs:** Total orders, today's orders, in-preparation count, verified sales revenue.
  2. **Order Management:** View items, advance status, cancel with notes, verify Easypaisa payments, print receipts.
  3. **Menu & Product Management:** Change prices, toggle sold out / in stock, edit descriptions, confirm draft dishes, add new items.
  4. **Deals & Combos:** Edit the Chinese Macaroni + 6 Steam Momos + Cold Drink promo.
  5. **AI Food Image Studio:** Select dish, input photography instructions, generate via Gemini 3.1 Flash Lite Image, preview and assign with 1-click.
  6. **Settings:** Edit delivery fee, minimum order, opening hours, WhatsApp number, and Easypaisa details.
  7. **Customer Messages:** Read inquiries submitted from the contact form.
  8. **Audit Trail:** Timestamped record of all admin activities.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Express full-stack server mounted with Vite middlewares in dev (`server.ts`).
- **AI Models:** `@google/genai` (Gemini 3.8 Flash for customer service chat, Gemini 3.1 Flash Lite Image for studio photography).
- **Storage:** Persistent file-backed JSON database in `data/saadaat_store.json`.

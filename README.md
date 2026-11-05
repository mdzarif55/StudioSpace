# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

> **Live Production Deployment:** [https://studiospace-app.vercel.app](https://studiospace-app.vercel.app) *(Deploy URL placeholder / configurable in Vercel or Render)*  
> **Backend API Service:** [https://studiospace-api.onrender.com](https://studiospace-api.onrender.com) *(Configurable for production deployment)*

---

## 🌟 Platform Overview & Core Features

StudioSpace is a high-performance peer-to-peer marketplace engineered specifically for filmmakers, photographers, audio engineers, podcasters, and visual artists. Studio hosts can list their production spaces—ranging from two-wall daylight cyc walls and cinema sound stages to multi-cam podcast lounges, Neve recording suites, and ceramic workshops. Fellow creators can discover, filter, inspect dynamic availability, and reserve studio slots with transparent pricing and real-time collision prevention.

### Key Highlights & Features:
- 🎬 **Dynamic Hero & Featured Studios (`.limit(6)`):** High-impact interactive hero slider with real-time dynamic studio fetching from MongoDB, showcasing top-rated creative spaces with category badges, hourly rates, and ratings.
- ⚡ **Interactive Category Filtering & Exploration:** Deep exploration directory allowing creators to filter across Photo Studios, Film Stages, Podcast Lounges, Music Suites, and Art Workshops, with live search and price sorting.
- 🛡️ **Challenge 1 — JWT Security with HTTPOnly Cookies:** Robust authentication where mutations (`POST /api/studios`, `DELETE /api/studios/:id`, `POST /api/bookings`) are guarded by JWT tokens stored securely in HTTPOnly cookies, rejecting unauthorized requests with `401 Unauthorized`.
- ⏱️ **Challenge 2 — Double-Booking Collision Prevention:** Strict server-side collision algorithm verifying time slot overlaps (`newStart < existingEnd && newEnd > existingStart`) on the same shoot date against existing Confirmed/Pending bookings, rejecting collisions with clear descriptive alerts.
- 🌓 **Challenge 3 — Full-System Light & Dark Mode:** Global theme toggler with instantaneous transition across all cards, navigation, modals, and typography, persisted in browser `localStorage`.
- 📄 **Optional Challenge — Downloadable PDF Booking Invoices:** Instant one-click branded PDF invoice generation using `jsPDF` and `jspdf-autotable`, itemizing hours, rates, and escrow deposits.
- ❤️ **Optional Challenge — Saved Studios Wishlist:** Heart icon on studio cards allowing logged-in creators to save favorite production spaces directly to MongoDB.
- 🔄 **Single-Page Application Reload Resilience:** Session persistence with zero premature login redirects or route crash errors on refreshing private pages (`/my-listings`, `/add-studio`, `/my-bookings`).
- 🔔 **Modern Feedback Standards:** Zero browser `alert()` popups; Sonner toast notifications and custom animated modal dialogs (including delete confirmation modals).
- 🚫 **Documentation Integrity:** Absolutely zero *Lorem Ipsum* text anywhere on the platform; all copy reflects real production industry terminology and equipment.

---

## 🛠️ Technology Stack

| Layer | Technologies Selected |
| :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide React**, **Sonner** (Modern Toasts), **jsPDF** (Invoice Engine) |
| **Backend** | **Node.js**, **Express.js**, **TypeScript**, **MongoDB** (Mongoose ODM + Embedded In-Memory Driver Fallback) |
| **Authentication & Security** | **JWT (JSON Web Tokens)**, **HTTPOnly Cookies**, **bcryptjs** (10-round salted hashing), **CORS with Credentials** |
| **Database Collections** | `users`, `studios`, `bookings`, `wishlists` |

---

## 🔑 Examiner Test Credentials

To facilitate rapid testing, you can use the **1-Click Quick-Fill buttons** on the Login page (`/login`) or enter the following pre-seeded credentials:

### 1. Examiner Creator Account:
- **Email:** `examiner@studiospace.com`
- **Password:** `Examiner123!`
- **Role:** Creator / Renter *(Has pre-seeded sample bookings in `/my-bookings` ready to inspect, test cancellation, or export PDF invoices)*

### 2. Studio Host Account:
- **Email:** `host@studiospace.com`
- **Password:** `Host123!`
- **Role:** Studio Host *(Owns multiple verified studio stages in `/my-listings` ready for editing or deletion)*

### 3. Password Validation Requirements for New Registrations:
When registering a new account on `/register`, the form enforces:
- Minimum of 6 characters in length
- At least one uppercase letter (`[A-Z]`)
- At least one lowercase letter (`[a-z]`)

---

## 🚀 Local Setup & Installation Steps

### Prerequisites:
- **Node.js:** v18.0.0 or higher (v22.x recommended)
- **npm:** v9.x or higher

### Step 1: Clone or Navigate to the Workspace
```bash
git clone <repository-url>
cd StudioSpace
```

### Step 2: Setup & Run the Backend Server
The server includes a zero-config automatic in-memory MongoDB fallback, meaning you do not need an external MongoDB running to test immediately. If you wish to connect to MongoDB Atlas, simply provide your connection string in `server/.env`.

```bash
cd server
npm install
npm run dev
# Server starts at http://localhost:5000
```

### Step 3: Setup & Run the Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Next.js app starts at http://localhost:3000
```

### Step 4: Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📊 Notable Git Commits Summary

- **Client-Side Repository (`client/`):** **25 notable GitHub commits** documenting the incremental implementation of App Router pages, auth context, theme toggling, CRUD operations, booking engine, and PDF export.
- **Server-Side Repository (`server/`):** **9 notable GitHub commits** documenting Express setup, Mongoose schemas, JWT HTTPOnly security, collision prevention algorithms, and seed datasets.


# 🚀 Affordly – Full Stack E-Commerce Platform

A modern, dark-themed e-commerce web application with neon UI, built using React, Vite, Tailwind CSS, Zustand, and Supabase.

---

## ✨ Features

### 🛍️ Customer Features

* Browse products (Watches, Fabrics, Shoes)
* Advanced filtering & search
* Add to cart & wishlist
* Checkout & order history
* Responsive UI with animations

### 🛠️ Admin Dashboard

* Role-based access (Admin only)
* Add / Edit / Delete products
* Image upload (Supabase Storage)
* Manage orders & update status
* Dashboard analytics

---

## 🧱 Tech Stack

| Layer    | Technology       |
| -------- | ---------------- |
| Frontend | React + Vite     |
| Styling  | Tailwind CSS     |
| State    | Zustand          |
| Backend  | Supabase         |
| Auth     | Supabase Auth    |
| Database | PostgreSQL       |
| Storage  | Supabase Storage |

---

## 🔐 Authentication & Authorization

* Secure login/signup using Supabase Auth
* Role-based access control (admin/customer)
* Protected routes for admin panel

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/neonkart.git
cd neonkart
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

Add your Supabase credentials:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

### 3. Install dependencies

```bash
npm install
```

---

### 4. Setup database

Follow:
👉 `SUPABASE_SETUP.md`

---

### 5. Run project

```bash
npm run dev
```

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

---

## 📸 Screenshots

(Add screenshots later for portfolio)

---

## 🚀 Future Improvements

* Payment Integration (Razorpay/Stripe)
* Product reviews & ratings
* Admin analytics charts
* AI-based recommendations

---

## 👨‍💻 Author

Yash Koolwal
B.Tech AI & Data Science Student

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!

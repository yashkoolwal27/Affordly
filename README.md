# NeonKart

A full-stack, dark-themed e-commerce web application with neon accents built with React, Vite, Tailwind CSS, and Supabase.

# website 

[Affordly](https://affordly-three.vercel.app)

## Features
- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS v3
- **State Management**: Zustand (Auth, Cart, Products, Orders, Admin, Wishlist stores)
- **Backend & Database**: Supabase (PostgreSQL, Storage, Auth)
- **Role-Based Access**: Customer flows and separate Admin dashboard
- **UI/UX**: Responsive dark mode with glassmorphism, Framer Motion animations, toast notifications.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Active Supabase Project

### Installation

1. Copy the environment file template and insert your keys:
   ```bash
   cp .env.example .env
   ```
2. Navigate to your Supabase project settings and copy your `Project URL` and `anon public key` into the `.env` file.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Follow the full setup instructions for tables, RLS, and storage in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

5. Run the development server:
   ```bash
   npm run dev
   ```

## Production
To build for production:
```bash
npm run build
```
And preview the build:
```bash
npm run preview
```

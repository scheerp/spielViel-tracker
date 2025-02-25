SpielViel-Tracker

## Overview

The SpielViel-Tracker App allows visitors to view, in real time, the availability status of board games at the event. Helpers and admins can authenticate via NextAuth to manage game checkouts and returns, updating the availability in the database.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Real-Time Status:** Visitors can see which games are available or checked out in real time.
- **Authentication:** Helpers and admins sign in via NextAuth.
- **Game Management:** Authenticated users can check out (loan) or return games.
- **Responsive UI:** Built using React and Next.js (App Router).

## Technology Stack

- **Framework:** React, Next.js (App Router)
- **Authentication:** NextAuth
- **Deployment:** Vercel

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd frontend

   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Configure environment variables: Create a .env.local file in the root directory with the following variables:**

   ```bash
   NEXT_PUBLIC_API_URL=<your-backend-url>
   NEXT_PUBLIC_SUPABASE_API_URL=<your-supabase-api-url>
   NEXT_PUBLIC_SUPABASE_API_KEY=<your-supabase-api-key>
   NEXTAUTH_SECRET=<next-auth-secret>
   # Other NextAuth or app-specific configurations as needed
   ```

4. **Start the development server:**

   ```bash
   npm run dev

   ```

5. **Build and Deployment: The project is configured for Vercel. Each push to the repository triggers an automatic deployment on Vercel.**

## Usage

- Visitors: View the live status of the board games.
- Helpers/Admins: Sign in via the authentication page to check out or return games.
- Navigation: Utilizes Next.js App Router for dynamic and optimized routing.

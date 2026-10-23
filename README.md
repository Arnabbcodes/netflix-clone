# 🎬 Netflix Clone

A modern, responsive **Netflix Clone** web application built with **React 19**, **Vite**, and **Supabase Authentication**, featuring movie data and trailers powered by **The Movie Database (TMDB) API**.

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646C9A?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- **🔐 User Authentication**: Secure Sign-up and Sign-in powered by **Supabase Auth** with persistent user sessions and real-time state synchronization.
- **🎥 Dynamic Movie Browsing**: Fetches live movie categories (*Now Playing*, *Popular*, *Top Rated*, and *Upcoming*) via the **TMDB API** with seamless local fallback.
- **▶️ Video Player & Trailers**: Dynamic movie trailer page (`/player/:id`) that fetches and embeds official YouTube trailers with movie metadata and release info.
- **🎨 Authentic Netflix UI**:
  - High-resolution hero banner with backdrop art, description, and action buttons.
  - Horizontally scrollable title rows with smooth scroll arrow controls and mouse wheel support.
  - Responsive navigation bar with search, notifications, profile dropdown, and sign-out.
  - Netflix-themed loading screen and animated transitions.
- **🔔 Interactive Toast Notifications**: Real-time feedback on authentication actions and error handling via `react-toastify`.
- **🚀 Production Ready for Vercel**: Includes `vercel.json` rewrites to prevent 404 errors on direct URL access or page reload.

---

## 🛠️ Tech Stack

- **Frontend Library**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Backend / Authentication**: [Supabase](https://supabase.com/)
- **APIs**: [The Movie Database (TMDB)](https://www.themoviedb.org/) & YouTube Embed
- **Notifications**: [React-Toastify](https://fkhadra.github.io/react-toastify/)
- **Icons & Styling**: Pure CSS with responsive Flexbox & CSS Grid

---

## 📂 Project Structure

```text
netflix-clone/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Logos, icons, banners, and static card assets
│   ├── components/
│   │   ├── Footer/         # Netflix-themed footer with links & copyright
│   │   ├── Loading/        # Animated Netflix loader component
│   │   ├── Navbar/         # Header navigation bar with user controls
│   │   └── Titlecards/     # Horizontal scrollable movie card carousel
│   ├── pages/
│   │   ├── Home/           # Main browse dashboard with hero banner & categories
│   │   ├── Login/          # Sign In / Sign Up authentication page
│   │   └── Player/         # Trailer playback page with YouTube integration
│   ├── App.jsx             # Main routing & authentication provider
│   ├── index.css           # Global CSS variables, resets, and typography
│   ├── main.jsx            # Application bootstrap with BrowserRouter
│   └── supabase.js         # Supabase client configuration & auth service
├── .env.example            # Sample environment variables
├── package.json            # Project dependencies and npm scripts
├── vercel.json             # Vercel SPA routing configuration
└── vite.config.js          # Vite build configuration
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A free [Supabase](https://supabase.com/) account (optional for full auth features)

### 1. Clone the Repository

```bash
git clone https://github.com/Arnabbcodes/netflix-clone.git
cd netflix-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Add your Supabase credentials in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note:** If you run the project without Supabase credentials, the app includes a fallback demo mode that lets you test login and explore the interface offline.

### 4. Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` folder |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Runs ESLint to check for code quality and style issues |

---

## 🌐 Deploy to Vercel

This repository is pre-configured with [vercel.json](vercel.json) to handle Single Page Application (SPA) routing cleanly.

### Deploying via Vercel Dashboard

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Arnabbcodes/netflix-clone.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
3. Import the `Arnabbcodes/netflix-clone` repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use it for educational and portfolio purposes.

---

## 👨‍💻 Author

**Arnab**
- GitHub: [@Arnabbcodes](https://github.com/Arnabbcodes)

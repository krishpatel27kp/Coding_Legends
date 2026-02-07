# DataPulse – API-First Form Tracking

DataPulse is a production-ready SaaS platform for universal website form data tracking, featuring the premium "Midnight Aurora" design theme.

## 🚀 Features

-   **Premium UI/UX**: "Midnight Aurora" theme with Deep Navy backgrounds, Electric Purple accents, and glassmorphism effects.
-   **Dashboard**: Real-time analytics with interactive charts (Recharts) and smooth animations (Framer Motion).
-   **Auth**: Secure user registration and login using JWT.
-   **Projects**: Create projects and generate API keys for form tracking.
-   **Ingestion**: High-performance API for form data submission.
-   **Responsive**: Fully optimized for mobile and desktop.

## 🛠 Tech Stack

### Frontend (Client)
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Theming**: `next-themes` (Dark/Light mode support)

### Backend (Server)
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Validation**: Zod

## 📂 Project Structure

-   `client`: Next.js application (Frontend)
-   `server`: Express application (Backend API)

## 🔧 Prerequisites

-   Node.js (v18+)
-   PostgreSQL
-   Redis (Optional)

## 🏁 Getting Started

### 1. Database Setup

Ensure PostgreSQL is running. You can use Docker:

```bash
docker-compose up -d
```
Or configure your `.env` with a local connection string.

### 2. Project Setup

Install all dependencies from the root directory:

```bash
npm install
```

### 3. Running the Project

Start both client and server concurrently:

```bash
npm run dev
```

-   **Client**: `http://localhost:3000`
-   **Server**: `http://localhost:4000`

## 📡 API Usage

**Endpoint**: `POST http://localhost:4000/api/v1/submit/:apiKey`

```javascript
fetch('http://localhost:4000/api/v1/submit/YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    message: 'Hello form DataPulse!'
  })
});
```

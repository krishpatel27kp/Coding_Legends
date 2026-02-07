# DataPulse – API-First Form Tracking 🚀

**DataPulse** is a production-ready SaaS platform built for the modern web. It provides a seamless, API-first approach to collecting and managing form data from any website or application. Featuring the premium **"Midnight Aurora"** design system, it's built for stability, technical teams, and premium SaaS positioning.

---

## 🚀 Key Features

-   **Midnight Aurora UI/UX**: A bespoke design system with Deep Navy backgrounds, Electric Purple accents, and refined glassmorphism for a professional dashboard experience.
-   **Real-time Analytics**: Interactive charts powered by Recharts with fluid Framer Motion animations.
-   **API-First Ingestion**: High-performance endpoint for form data submission from any source (React, Vue, Svelte, HTML, iOS, Android).
-   **Secure by Design**: JWT-based authentication, bank-grade encryption for data at rest, and Zod schema validation.
-   **Developer Experience**: Automated project creation, instant API key generation, and comprehensive documentation.

## 🛠 Tech Stack

### Frontend (Client)
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **State & Auth**: React Context / Next-Themes

### Backend (Server)
-   **Runtime**: Node.js / Express.js
-   **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
-   **Validation**: Zod

---

## 🏁 Getting Started

### 1. Database Setup
Ensure PostgreSQL is running. Navigate to `/server` and run:
```bash
docker-compose up -d
npx prisma generate
npx prisma db push
```

### 2. Project Installation
Install all dependencies from the root directory:
```bash
npm install
```

### 3. Development Mode
Start both client and server concurrently:
```bash
npm run dev
```
-   **Client**: `http://localhost:3000`
-   **Server**: `http://localhost:4000`

---

## 🚢 Deployment

### Frontend (Netlify)
1. Import your repository to **Netlify**.
2. Netlify will auto-detect the `netlify.toml` configuration.
3. Ensure the base directory is set to `client`.
4. The build command is `npm run build` and the publish directory is `.next`.

### Backend
Deploy the `server` directory to platform like **Render** or **Railway**. Ensure you set your `DATABASE_URL` environment variables.

---

## 📡 API Usage Example

**Endpoint**: `POST http://localhost:4000/api/v1/submit/:apiKey`

```javascript
fetch('https://your-api.com/api/v1/submit/YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    message: 'Hello from DataPulse!'
  })
});
```

---

© 2026 DataPulse Labs. All rights reserved.

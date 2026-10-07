# TradeFlow

TradeFlow is a trading journal and analytics workspace built for traders who want to review execution quality, risk discipline, and performance trends without relying on guesswork. It combines trade logging, chart-based analysis, portfolio metrics, educational resources, and market context in one place.

## What this project does

TradeFlow helps traders:

- Log and review individual trades, including screenshots and notes
- Track performance over time with analytics and dashboards
- Monitor risk and position sizing with a built-in calculator
- Review market news and economic events to support decisions
- Save strategies, psychological notes, and trading goals
- Keep a personal journal around execution quality, discipline, and lessons learned

The app is intended as a practical trading workflow tool, not just a UI shell. The backend and frontend are designed to work together so users can maintain their trading records and analytics in a single system.

## Tech stack

Frontend
- React 19
- Vite
- React Router
- Axios
- React Hook Form
- Framer Motion
- React Icons
- React Query
- Plain CSS component styling

Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication with access tokens and refresh cookies
- Cloudinary for file uploads and avatars
- Nodemailer for password reset emails
- Finnhub API for market news and economic calendar data
- Security middleware including Helmet, rate limiting, and input sanitization

## Project structure

- `frontend/` — React app for the user interface
- `backend/` — Express API and MongoDB integration
- `README.md` — project overview and setup guide

## Prerequisites

Before starting the app, make sure you have:

- Node.js 18 or newer
- npm
- A MongoDB database (local or hosted)
- A Finnhub API key for market news and economic calendar data
- Cloudinary credentials for image uploads
- SMTP credentials if you want password reset emails to work

## Quick start

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd tradeflow
```

### 2) Configure the backend environment

From the backend folder, copy the example environment file and update the values:

```bash
cd backend
copy .env.example .env
```

Then edit `.env` and fill in all required values:

- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FINNHUB_API_KEY`

A full example is included in `backend/.env.example`.

### 3) Install backend dependencies

```bash
npm install
```

### 4) Start the backend

```bash
npm run dev
```

The API runs by default on:

- http://localhost:5000

### 5) Configure the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs by default on:

- http://localhost:5173

## How to use the app

Once both servers are running:

1. Open the frontend in your browser at `http://localhost:5173`
2. Create an account or sign in
3. Add your trading account and journal entries
4. Record trade details such as entry, exit, size, setup, screenshot, and notes
5. Review your dashboard and analytics for trends in performance
6. Use the risk calculator, goals, strategy library, and psychology sections to improve consistency

## Main application features

- Landing and authentication flow
- Dashboard with performance summary
- Trading journal and detailed trade records
- Charting and market context integration
- Watchlist
- Risk calculator
- Economic calendar
- Market news
- Strategy library
- Psychology and journaling tools
- Goals and personal progress tracking
- Profile and settings management

## API overview

The backend exposes REST endpoints for areas such as:

- authentication and user management
- trade records
- analytics
- strategy data
- notes and journal entries
- goals and psychology tracking
- profile and avatar uploads
- watchlists
- market news and economic calendar data

These endpoints are served by the Express server under the backend project.

## Notes and current limitations

This project is a working trading dashboard, but some areas are still intentionally lightweight or placeholder-driven:

- The notes editor is currently a plain textarea rather than a rich text editor
- Watchlist price data may be mocked or placeholder content until a real market data provider is integrated
- Some goal-achievement UI pieces may be in progress even though the progress logic is present

## Development notes

For local development:

- Keep the backend and frontend running in separate terminals
- Use the backend `.env` file for all secrets and service credentials
- If you want to test the API directly, point requests at `http://localhost:5000`

## License

This project does not currently include a license file. If you plan to share or distribute it publicly, add an appropriate open-source license before doing so.

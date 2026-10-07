import { AppError, asyncHandler } from "../middleware/errorHandler.js";

/**
 * Proxies Finnhub's economic calendar endpoint. Returns event importance,
 * currency, forecast/previous/actual values — everything the Economic
 * Calendar page needs. Countdown timers are computed client-side from
 * each event's timestamp.
 */
export const getEconomicCalendar = asyncHandler(async (req, res) => {
  const { from, to, currency, importance } = req.query;
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new AppError(
      "Economic calendar isn't configured yet — add FINNHUB_API_KEY to the backend .env",
      503
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const params = new URLSearchParams({
    from: from || today,
    to: to || nextWeek,
    token: apiKey,
  });

  const response = await fetch(`https://finnhub.io/api/v1/calendar/economic?${params}`);
  if (!response.ok) {
    throw new AppError("Failed to fetch economic calendar from provider", 502);
  }

  const data = await response.json();
  let events = data.economicCalendar || [];

  if (currency) {
    events = events.filter((e) => e.country === currency.toUpperCase());
  }
  if (importance) {
    events = events.filter((e) => String(e.impact) === String(importance));
  }

  res.json({ success: true, events });
});

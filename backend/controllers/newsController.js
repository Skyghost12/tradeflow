import { AppError, asyncHandler } from "../middleware/errorHandler.js";

/**
 * Proxies Finnhub's forex/general news endpoint. Using a server-side
 * proxy (rather than calling from the frontend) keeps the API key
 * off the client and lets us cache/normalize the response shape.
 * Get a free key at finnhub.io and set FINNHUB_API_KEY in .env.
 */
export const getMarketNews = asyncHandler(async (req, res) => {
  const { currency } = req.query;
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new AppError(
      "Market news isn't configured yet — add FINNHUB_API_KEY to the backend .env",
      503
    );
  }

  const response = await fetch(
    `https://finnhub.io/api/v1/news?category=forex&token=${apiKey}`
  );
  if (!response.ok) {
    throw new AppError("Failed to fetch market news from provider", 502);
  }

  let articles = await response.json();

  if (currency) {
    const upper = currency.toUpperCase();
    articles = articles.filter(
      (a) =>
        a.headline?.toUpperCase().includes(upper) ||
        a.summary?.toUpperCase().includes(upper)
    );
  }

  const normalized = articles.slice(0, 30).map((a) => ({
    id: a.id,
    headline: a.headline,
    summary: a.summary,
    source: a.source,
    url: a.url,
    image: a.image,
    publishedAt: new Date(a.datetime * 1000).toISOString(),
  }));

  res.json({ success: true, news: normalized });
});

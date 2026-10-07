import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiExternalLink } from "react-icons/fi";
import Card from "../components/UI/Card";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import { getMarketNews } from "../services/newsService";
import { formatDateTime } from "../utils/format";
import "./MarketNews.css";

const CURRENCIES = ["", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"];

const MarketNews = () => {
  const [currency, setCurrency] = useState("");

  const { data: news = [], isLoading, isError, error } = useQuery({
    queryKey: ["market-news", currency],
    queryFn: () => getMarketNews(currency || undefined),
    retry: false,
  });

  return (
    <div className="market-news">
      <div className="market-news__filters">
        {CURRENCIES.map((c) => (
          <button
            key={c || "all"}
            className={`goals-tab ${currency === c ? "goals-tab--active" : ""}`}
            onClick={() => setCurrency(c)}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <EmptyState
          title="Market news isn't configured yet"
          message={error?.response?.data?.message || "Add a FINNHUB_API_KEY to the backend to enable this feed."}
        />
      ) : news.length === 0 ? (
        <EmptyState title="No news found" message="Try a different currency filter." />
      ) : (
        <div className="market-news__grid">
          {news.map((article) => (
            <a href={article.url} target="_blank" rel="noopener noreferrer" key={article.id}>
              <Card hoverable className="news-card">
                {article.image && <div className="news-card__image" style={{ backgroundImage: `url(${article.image})` }} />}
                <div className="news-card__body">
                  <div className="news-card__meta">
                    <span>{article.source}</span>
                    <span>{formatDateTime(article.publishedAt)}</span>
                  </div>
                  <h4>{article.headline}</h4>
                  <p>{article.summary}</p>
                  <span className="news-card__link"><FiExternalLink /> Read more</span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketNews;

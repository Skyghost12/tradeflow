import { useState, useEffect, useRef } from "react";
import Card from "../components/UI/Card";
import "./Charts.css";

const PAIRS = [
  { label: "EUR/USD", symbol: "FX:EURUSD" },
  { label: "GBP/USD", symbol: "FX:GBPUSD" },
  { label: "USD/JPY", symbol: "FX:USDJPY" },
  { label: "AUD/USD", symbol: "FX:AUDUSD" },
  { label: "XAU/USD", symbol: "OANDA:XAUUSD" },
  { label: "BTC/USD", symbol: "COINBASE:BTCUSD" },
];

const Charts = () => {
  const [symbol, setSymbol] = useState(PAIRS[0].symbol);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(10, 14, 20, 1)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_top_toolbar: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="charts-page">
      <div className="charts-page__tabs">
        {PAIRS.map((p) => (
          <button
            key={p.symbol}
            className={`charts-page__tab ${symbol === p.symbol ? "charts-page__tab--active" : ""}`}
            onClick={() => setSymbol(p.symbol)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card padded={false} className="charts-page__card">
        <div className="tradingview-widget-container" ref={containerRef} />
      </Card>
    </div>
  );
};

export default Charts;

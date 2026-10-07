import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiX, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import EmptyState from "../components/UI/EmptyState";
import { useAuth } from "../context/AuthContext";
import { updateWatchlist } from "../services/profileService";
import "./Watchlist.css";

// Placeholder market data — a production build would source this from a
// live forex data feed (e.g. Twelve Data / OANDA) via a backend proxy,
// the same pattern used for News and the Economic Calendar.
const mockMarketData = (pair) => {
  const seed = pair.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const change = ((seed % 200) - 100) / 100;
  return {
    price: (1 + (seed % 500) / 1000).toFixed(4),
    change,
    spread: ((seed % 20) / 10).toFixed(1),
    atr: ((seed % 80) / 100).toFixed(4),
  };
};

const Watchlist = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [newPair, setNewPair] = useState("");

  const mutation = useMutation({
    mutationFn: updateWatchlist,
    onSuccess: (watchlist) => setUser((u) => ({ ...u, watchlist })),
  });

  const pairs = user?.watchlist || [];

  const addPair = (e) => {
    e.preventDefault();
    const clean = newPair.trim().toUpperCase();
    if (!clean || pairs.includes(clean)) return;
    mutation.mutate([...pairs, clean]);
    setNewPair("");
  };

  const removePair = (pair) => {
    mutation.mutate(pairs.filter((p) => p !== pair));
  };

  return (
    <div className="watchlist">
      <form className="watchlist__add" onSubmit={addPair}>
        <input
          placeholder="Add pair, e.g. EURUSD"
          value={newPair}
          onChange={(e) => setNewPair(e.target.value)}
        />
        <Button type="submit" icon={FiPlus} size="sm">Add</Button>
      </form>

      {pairs.length === 0 ? (
        <EmptyState title="Your watchlist is empty" message="Add a pair above to start tracking it." />
      ) : (
        <Card padded={false}>
          <div className="watchlist-table">
            <div className="watchlist-table__head">
              <span>Pair</span>
              <span>Trend</span>
              <span>Price</span>
              <span>Daily Change</span>
              <span>Spread</span>
              <span>ATR</span>
              <span></span>
            </div>
            {pairs.map((pair) => {
              const d = mockMarketData(pair);
              const up = d.change >= 0;
              return (
                <div className="watchlist-table__row" key={pair}>
                  <span className="watchlist-table__pair">{pair}</span>
                  <span className={up ? "trend-up" : "trend-down"}>
                    {up ? <FiTrendingUp /> : <FiTrendingDown />}
                  </span>
                  <span className="mono">{d.price}</span>
                  <span className={`mono ${up ? "trend-up" : "trend-down"}`}>
                    {up ? "+" : ""}{d.change.toFixed(2)}%
                  </span>
                  <span className="mono">{d.spread}</span>
                  <span className="mono">{d.atr}</span>
                  <button className="watchlist-table__remove" onClick={() => removePair(pair)} aria-label="Remove">
                    <FiX />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Watchlist;

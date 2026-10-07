import { useState, useEffect } from "react";

const getCountdown = (targetDate) => {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return "Released";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h ${minutes}m`;
};

const CountdownTimer = ({ targetDate }) => {
  const [label, setLabel] = useState(() => getCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setLabel(getCountdown(targetDate)), 60_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="mono">{label}</span>;
};

export default CountdownTimer;

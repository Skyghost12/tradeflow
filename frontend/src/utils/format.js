export const formatCurrency = (value, currency = "USD") => {
  const sign = value < 0 ? "-" : value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(Math.abs(value || 0))}`;
};

export const formatPercent = (value) => `${(value ?? 0).toFixed(1)}%`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const profitTone = (value) => (value > 0 ? "bull" : value < 0 ? "bear" : "neutral");

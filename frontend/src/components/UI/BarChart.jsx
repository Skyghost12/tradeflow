import "./BarChart.css";

// Minimal dependency-free bar chart. data: [{ label, value }]
const BarChart = ({ data, tone = "bull", formatValue = (v) => v }) => {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  return (
    <div className="bar-chart">
      {data.map((d) => {
        const height = Math.max((Math.abs(d.value) / max) * 100, 2);
        const negative = d.value < 0;
        return (
          <div className="bar-chart__col" key={d.label}>
            <span className="bar-chart__value">{formatValue(d.value)}</span>
            <div className="bar-chart__track">
              <div
                className={`bar-chart__bar bar-chart__bar--${negative ? "bear" : tone}`}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="bar-chart__label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;

import "./StatCard.css";

// tone: bull | bear | neutral | gold — colors the value and accent bar
const StatCard = ({ label, value, icon: Icon, tone = "neutral", suffix = "" }) => (
  <div className={`stat-card stat-card--${tone}`}>
    <div className="stat-card__top">
      <span className="stat-card__label">{label}</span>
      {Icon && <Icon className="stat-card__icon" />}
    </div>
    <div className="stat-card__value">
      {value}
      {suffix && <span className="stat-card__suffix">{suffix}</span>}
    </div>
  </div>
);

export default StatCard;

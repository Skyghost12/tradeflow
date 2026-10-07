import "./EmptyState.css";

const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="empty-state">
    {Icon && <Icon className="empty-state__icon" />}
    <h4>{title}</h4>
    {message && <p>{message}</p>}
    {action && <div className="empty-state__action">{action}</div>}
  </div>
);

export default EmptyState;

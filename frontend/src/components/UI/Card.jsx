import "./Card.css";

const Card = ({ children, className = "", padded = true, hoverable = false, ...rest }) => (
  <div
    className={`card ${padded ? "card--padded" : ""} ${hoverable ? "card--hoverable" : ""} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;

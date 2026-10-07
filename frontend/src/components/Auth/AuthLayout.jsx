import { Link } from "react-router-dom";
import "./AuthLayout.css";

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="auth-layout">
    <div className="auth-layout__panel">
      <Link to="/" className="auth-layout__brand">
        <span className="auth-layout__mark">T</span>
        <span>TradeFlow</span>
      </Link>
      <div className="auth-layout__quote">
        <p>
          "The market doesn't repeat your mistakes back to you. Your journal does — if you keep one."
        </p>
      </div>
    </div>

    <div className="auth-layout__content">
      <div className="auth-layout__form-wrap">
        <h1>{title}</h1>
        {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-layout__footer">{footer}</div>}
      </div>
    </div>
  </div>
);

export default AuthLayout;

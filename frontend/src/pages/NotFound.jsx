import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <div className="not-found">
    <span className="not-found__code">404</span>
    <h1>This pair isn't listed</h1>
    <p>The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="not-found__link">Back to home</Link>
  </div>
);

export default NotFound;

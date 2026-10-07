import "./Button.css";

const Button = ({
  children,
  variant = "primary", // primary | secondary | ghost | danger
  size = "md", // sm | md | lg
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="btn__icon" />}
      {!loading && <span>{children}</span>}
      {!loading && Icon && iconPosition === "right" && <Icon className="btn__icon" />}
    </button>
  );
};

export default Button;

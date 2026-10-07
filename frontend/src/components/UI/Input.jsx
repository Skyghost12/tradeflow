import { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(({ label, error, icon: Icon, id, ...rest }, ref) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-group__label">
          {label}
        </label>
      )}
      <div className={`input-group__field ${error ? "input-group__field--error" : ""}`}>
        {Icon && <Icon className="input-group__icon" />}
        <input ref={ref} id={id} {...rest} />
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;

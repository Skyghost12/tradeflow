import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import AuthLayout from "../components/Auth/AuthLayout";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import "../components/Auth/AuthForm.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed, please try again");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where your last session ended."
      footer={
        <>
          Don't have an account? <Link to="/signup">Create one</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="auth-form__error">{serverError}</div>}

        <Input
          id="email"
          label="Email"
          type="email"
          icon={FiMail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          icon={FiLock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <div className="auth-form__row">
          <label className="auth-form__checkbox">
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          className="auth-form__submit"
        >
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import AuthLayout from "../components/Auth/AuthLayout";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import "../components/Auth/AuthForm.css";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const { confirmPassword, ...payload } = data;
      await signup(payload);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Signup failed, please try again");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start journaling your trades in under a minute."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="auth-form__error">{serverError}</div>}

        <Input
          id="username"
          label="Username"
          type="text"
          icon={FiUser}
          placeholder="trader_jane"
          error={errors.username?.message}
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "At least 3 characters" },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Letters, numbers, and underscores only",
            },
          })}
        />

        <Input
          id="email"
          label="Email"
          type="email"
          icon={FiMail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          icon={FiLock}
          placeholder="At least 8 characters, 1 number"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
            pattern: { value: /\d/, message: "Must include at least one number" },
          })}
        />

        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          icon={FiLock}
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords don't match",
          })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          className="auth-form__submit"
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;

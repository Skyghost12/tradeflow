import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import AuthLayout from "../components/Auth/AuthLayout";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { resetPasswordRequest } from "../services/authService";
import "../components/Auth/AuthForm.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async ({ password }) => {
    setServerError("");
    try {
      await resetPasswordRequest(token, password);
      navigate("/login", { state: { resetSuccess: true } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Reset link is invalid or expired");
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose something you haven't used before."
      footer={
        <>
          <Link to="/login">Back to login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="auth-form__error">{serverError}</div>}

        <Input
          id="password"
          label="New password"
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
          label="Confirm new password"
          type="password"
          icon={FiLock}
          placeholder="Re-enter your new password"
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
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;

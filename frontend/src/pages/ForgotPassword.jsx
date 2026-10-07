import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import AuthLayout from "../components/Auth/AuthLayout";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { forgotPasswordRequest } from "../services/authService";
import "../components/Auth/AuthForm.css";

const ForgotPassword = () => {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setServerError("");
    setSuccessMessage("");
    try {
      const message = await forgotPasswordRequest(email);
      setSuccessMessage(message);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong, try again");
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send a reset link."
      footer={
        <>
          Remembered it? <Link to="/login">Back to login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="auth-form__error">{serverError}</div>}
        {successMessage && <div className="auth-form__success">{successMessage}</div>}

        <Input
          id="email"
          label="Email"
          type="email"
          icon={FiMail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          className="auth-form__submit"
        >
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;

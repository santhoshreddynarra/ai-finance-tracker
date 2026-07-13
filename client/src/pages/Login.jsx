import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  // Clear server error when user starts typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) dispatch(clearError());
  };

  // Client-side validation
  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
    if (!form.password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const result = await dispatch(loginUser({ email: form.email.trim(), password: form.password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Server error banner */}
        {error && (
          <div role="alert" className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <InputField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <Button id="login-btn" type="submit" loading={loading}>
          Sign in
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;

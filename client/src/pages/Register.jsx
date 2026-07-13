import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) dispatch(clearError());
  };

  // Client-side validation
  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    else if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";

    if (!form.password) errors.password = "Password is required.";
    else if (form.password.length < 8) errors.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const result = await dispatch(
      registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    );
    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start managing your finances smarter">
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
          id="name"
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          autoComplete="name"
        />

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
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="new-password"
        />

        <InputField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <Button id="register-btn" type="submit" loading={loading}>
          Create account
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;

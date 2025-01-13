import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password
      );
      if (result.success) {
        navigate("/dashboard");
      } else {
        setServerError(
          result.error || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.name ? "border-red-500" : ""
            }`}
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email ? "border-red-500" : ""
            }`}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password ? "border-red-500" : ""
            }`}
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;

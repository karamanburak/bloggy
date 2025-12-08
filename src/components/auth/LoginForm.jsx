import { Form } from "formik";
import { useSelector } from "react-redux";
import { object, string } from "yup";
import { useState } from "react";
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiUser } from "react-icons/hi";

export const SignInScheme = object({
  usernameOrEmail: string()
    .required("Username or Email is required!")
    .test(
      "is-email-or-username",
      "Please enter a valid username or email",
      (value) => {
        if (!value) return false;
        // Check if it's a valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a valid username (3-15 characters, alphanumeric and underscore)
        const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
        return emailRegex.test(value) || usernameRegex.test(value);
      }
    ),
  password: string().required("Password is required!"),
});

const LoginForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
  isSubmitting,
}) => {
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine if input is email or username
  const isEmailFormat = values.usernameOrEmail?.includes("@");
  const InputIcon = isEmailFormat ? HiMail : HiUser;

  return (
    <Form className="space-y-6">
      {/* Username or Email Field */}
      <div>
        <label
          htmlFor="usernameOrEmail"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Username or Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <InputIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            autoComplete="username"
            value={values.usernameOrEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-field pl-10 ${
              touched.usernameOrEmail && errors.usernameOrEmail
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="Enter your username or email"
          />
        </div>
        {touched.usernameOrEmail && errors.usernameOrEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.usernameOrEmail}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiLockClosed className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-field pl-10 pr-10 ${
              touched.password && errors.password
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || loading}
        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading || isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </Form>
  );
};

export default LoginForm;
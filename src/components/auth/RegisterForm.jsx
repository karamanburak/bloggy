import { Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiUser,
} from "react-icons/hi";

export const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3).max(15).required("Username is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "The password must be at least 8 characters long")
    .max(20, "The password may be a maximum of 20 characters long")
    .matches(/\d+/, "The password must contain at least one number!")
    .matches(
      /[a-z]/,
      "The password must contain at least one lowercase letter"
    )
    .matches(
      /[A-Z]/,
      "The password must contain at least one capital letter"
    )
    .matches(
      /[@$?!%&*.]+/,
      "The password must contain at least one special character (@$!%*?&.)"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Please make sure your passwords match")
    .required("Confirm Password is a required field"),
});

const registerFormField = [
  {
    id: "username",
    name: "username",
    label: "Username",
    type: "text",
    icon: HiUser,
    required: true,
  },
  {
    id: "email",
    name: "email",
    label: "Email Address",
    type: "email",
    icon: HiMail,
    required: true,
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    type: "password",
    icon: HiLockClosed,
    required: true,
  },
  {
    id: "confirmPassword",
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    icon: HiLockClosed,
    required: true,
  },
];

const RegisterForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
  isSubmitting,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Form className="space-y-4">
      <div className="space-y-4">
        {registerFormField.map((field) => {
          const IconComponent = field.icon;
          const isPasswordField =
            field.type === "password" &&
            (field.name === "password" || field.name === "confirmPassword");
          const showPasswordState =
            field.name === "password"
              ? showPassword
              : field.name === "confirmPassword"
              ? showConfirmPassword
              : false;

          return (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconComponent className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id={field.id}
                  name={field.name}
                  type={
                    isPasswordField
                      ? showPasswordState
                        ? "text"
                        : "password"
                      : field.type
                  }
                  autoComplete="off"
                  value={values[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pl-10 ${
                    isPasswordField ? "pr-10" : ""
                  } ${
                    touched[field.name] && errors[field.name]
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                {isPasswordField && (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswordState ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                )}
              </div>
              {touched[field.name] && errors[field.name] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full mt-6 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
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
            <span>Creating account...</span>
          </>
        ) : (
          <span>Sign Up</span>
        )}
      </button>
    </Form>
  );
};

export default RegisterForm;
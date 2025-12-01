import { Formik } from "formik";
import { Link } from "react-router-dom";
import useAuthCall from "../hooks/useAuthCall";
import LoginForm, { SignInScheme } from "../components/auth/LoginForm";
import AuthImage from "../components/global/AuthImage";
import Footer from "../components/home/Footer";
import image from "../assets/login.png";
import { HiUserGroup } from "react-icons/hi";

const Login = () => {
  const { login } = useAuthCall();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Form */}
          <div className="w-full order-2 lg:order-1">
            <div className="card p-8 lg:p-12 max-w-md mx-auto animate-slide-up">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-4">
                  <HiUserGroup className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to continue to Bloggy
                </p>
              </div>

              {/* Form */}
              <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                validationSchema={SignInScheme}
                onSubmit={(values, actions) => {
                  // Determine if it's email or username and send appropriate field
                  const isEmail = values.usernameOrEmail.includes("@");
                  const loginData = isEmail
                    ? { email: values.usernameOrEmail, password: values.password }
                    : { username: values.usernameOrEmail, password: values.password };
                  login(loginData);
                  actions.resetForm();
                  actions.setSubmitting(false);
                }}
                component={(props) => <LoginForm {...props} />}
              />

              {/* Footer Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Sign up for Bloggy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-full order-1 lg:order-2 hidden lg:block">
            <div className="animate-fade-in">
              <AuthImage image={image} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
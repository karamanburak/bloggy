import { Formik } from "formik";
import { Link } from "react-router-dom";
import RegisterForm, { SignupSchema } from "../components/auth/RegisterForm";
import Information from "../components/auth/Information";
import Footer from "../components/home/Footer";
import useAuthCall from "../hooks/useAuthCall";
import { HiUser, HiPlus } from "react-icons/hi";

const Register = () => {
  const { register } = useAuthCall();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Information */}
          <div className="w-full order-2 lg:order-1">
            <Information />
          </div>

          {/* Right Side - Form */}
          <div className="w-full order-1 lg:order-2">
            <div className="card p-8 lg:p-12 max-w-2xl mx-auto animate-slide-up">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-4 relative">
                  <HiUser className="w-8 h-8 text-white" />
                  <HiPlus className="w-4 h-4 text-white absolute -bottom-1 -right-1 bg-primary-600 rounded-full p-0.5" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Create Your Account
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join Bloggy and start sharing your stories
                </p>
              </div>

              {/* Form */}
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={(values, actions) => {
                  register(values);
                  actions.resetForm();
                  actions.setSubmitting(false);
                }}
                component={(props) => <RegisterForm {...props} />}
              />

              {/* Footer Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
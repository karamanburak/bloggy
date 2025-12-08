import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { HiHome, HiExclamationCircle } from "react-icons/hi";

const NotFound = () => {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev === 0 ? prev : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (count === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
            <HiExclamationCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-9xl font-bold text-gray-900 mb-4">
            404
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you are looking for could not be found or has been
            removed.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
          <p className="text-gray-700 mb-2">
            You will be automatically redirected to the home page in
          </p>
          <div className="text-4xl font-bold text-primary-600 mb-4">
            {count}
          </div>
          <p className="text-gray-600">seconds</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="btn-primary flex items-center space-x-2"
          >
            <HiHome className="w-5 h-5" />
            <span>Go to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserList from "../components/admin/UserList";
import UserActivity from "../components/admin/UserActivity";
import Footer from "../components/home/Footer";
import {
  HiUserGroup,
  HiChartBar,
  HiShieldCheck,
  HiHome,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const AdminPanel = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine tab from URL
  const getTabFromUrl = () => {
    const path = location.pathname;
    if (path.includes("/activities")) return "activity";
    if (path.includes("/users")) return "users";
    return "users"; // default
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Update tab when URL changes
  useEffect(() => {
    const path = location.pathname;
    // If only /admin, redirect to /admin/users
    if (path === "/admin") {
      navigate("/admin/users", { replace: true });
      return;
    }
    const tab = getTabFromUrl();
    setActiveTab(tab);
  }, [location.pathname, navigate]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "users") {
      navigate("/admin/users", { replace: true });
    } else if (tabId === "activity") {
      navigate("/admin/activities", { replace: true });
    }
  };

  const tabs = [
    {
      id: "users",
      name: "Users",
      icon: HiUserGroup,
      component: <UserList />,
    },
    {
      id: "activity",
      name: "Activities",
      icon: HiChartBar,
      component: <UserActivity />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-20 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage users and track activities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg">
                <HiShieldCheck className="w-5 h-5" />
                <span className="font-semibold">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </div>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <HiHome className="w-5 h-5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 animate-scale-in"></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 lg:p-8">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;


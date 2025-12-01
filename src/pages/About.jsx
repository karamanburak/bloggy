import { useEffect } from "react";
import Footer from "../components/home/Footer";
import useCategoryCall from "../hooks/useCategoryCall";
import { HiSparkles, HiUserGroup, HiLightBulb, HiBookOpen } from "react-icons/hi";

const avatars = [
  {
    name: "Ferenc Molnár",
    position: "Founder & Co-CEO",
  },
  {
    name: "Luca Guadagnino",
    position: "Co-CEO",
  },
  {
    name: "Diego Hitchcock",
    position: "Editor",
  },
  {
    name: "Dario Argento",
    position: "Editor",
  },
  {
    name: "Thomas Müller",
    position: "Editor",
  },
  {
    name: "Denis Schröder",
    position: "Editor",
  },
];

const About = () => {
  const { getCategory } = useCategoryCall();

  useEffect(() => {
    getCategory("categories");
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20 md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Unleash Your Creativity
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Dream, Explore, Create
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* About Content */}
          <div className="card p-8 lg:p-12 mb-12 animate-slide-up">
            <div className="flex items-center space-x-3 mb-8">
              <HiSparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                About Us
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">
                At Bloggy, we are passionate about sharing stories, insights,
                and knowledge across a variety of topics. Our mission is to
                create a platform where readers can find engaging content that
                informs, inspires, and entertains.
              </p>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <HiUserGroup className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Who We Are
                  </h3>
                </div>
                <p className="text-lg">
                  We are a diverse team of writers, editors, and enthusiasts who
                  come together to bring you fresh perspectives on topics that
                  matter. From technology and lifestyle to travel and personal
                  development, our team is dedicated to delivering high-quality
                  articles that resonate with our readers.
                </p>
              </div>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <HiLightBulb className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Our Mission
                  </h3>
                </div>
                <p className="text-lg">
                  Our mission is to connect people through the power of
                  storytelling. We believe that everyone has a story to tell and
                  valuable insights to share. By providing a space for these
                  stories, we hope to foster a community of curious and
                  thoughtful readers.
                </p>
              </div>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <HiBookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    What We Offer
                  </h3>
                </div>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>In-Depth Articles:</strong> Comprehensive and
                      well-researched articles that delve into various subjects.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>Personal Stories:</strong> Real-life experiences
                      and narratives that inspire and motivate.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>Expert Insights:</strong> Tips and advice from
                      industry experts and thought leaders.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      •
                    </span>
                    <span>
                      <strong>Engaging Content:</strong> Interactive and
                      multimedia content to enhance your reading experience.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl border-l-4 border-primary-500">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Join Our Community
                </h3>
                <p className="text-lg">
                  We invite you to join our growing community of readers and
                  contributors. Follow us on social media, subscribe to our
                  newsletter, and feel free to reach out with your thoughts and
                  feedback. Your voice is important to us, and we are always
                  eager to hear from our readers.
                </p>
              </div>

              <div className="mt-8 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Thank you for being a part of Bloggy. Together, let's dream,
                  explore, and create.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="card p-8 lg:p-12 animate-slide-up">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar.name}`}
                      alt={avatar.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary-500 shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {avatar.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {avatar.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
import { useNavigate } from "react-router-dom";
import { HiInformationCircle, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

const Information = () => {
  const navigate = useNavigate();

  return (
    <div className="card p-8 max-w-2xl mx-auto animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <HiInformationCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to Bloggy
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-primary-600 italic">
              On this blog site
            </strong>
            , you can freely share your thoughts and get ideas by reading blogs
            on topics you are curious about. This blog site is created for
            everyone to express their ideas.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <HiExclamationCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Rules to Follow
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <HiCheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>1-)</strong> When quoting from someone else's blog,
                    reference should be given.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiCheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>2-)</strong> Personal rights should be respected.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiCheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>3-)</strong> Advertising content should not be
                    written.
                  </span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-blue-700 font-medium">
                <strong>Note:</strong> Those who do not follow the rules will be
                banned from the site indefinitely.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate("/login")}
            className="btn-primary w-full"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Information;
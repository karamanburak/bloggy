import { useNavigate } from "react-router-dom";
import { HiSparkles, HiArrowRight, HiHome } from "react-icons/hi";

const PageHero = ({
  title,
  description,
  buttonText,
  buttonOnClick,
  buttonIcon,
  showHomeButton = false,
  padding = "py-24 md:py-32",
  icon: Icon = HiSparkles,
}) => {
  const navigate = useNavigate();

  return (
    <div className={`relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white ${padding} overflow-hidden`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Button - Absolute positioned at top */}
        {showHomeButton && (
          <div className="absolute top-[10px] left-4 sm:left-6 lg:left-8 z-20">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              aria-label="Go to dashboard"
            >
              <HiHome className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
          </div>
        )}
        
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-scale-in">
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 leading-[1.1] pb-3 overflow-visible">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up">
              {description}
            </p>
          )}

          {/* Button */}
          {buttonText && (
            <div className="flex items-center justify-center animate-slide-up">
              <button
                onClick={buttonOnClick}
                className="group inline-flex items-center space-x-3 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <span>{buttonText}</span>
                {buttonIcon || <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHero;


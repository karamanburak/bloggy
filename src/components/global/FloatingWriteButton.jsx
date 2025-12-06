import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

const FloatingWriteButton = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [bottomPosition, setBottomPosition] = useState(24); // 24px = bottom-6

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) {
        setBottomPosition(24);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const footerTop = footerRect.top;
      
      // When footer is visible (below or inside viewport)
      if (footerTop <= windowHeight) {
        // Get footer height and adjust position accordingly
        const footerHeight = footerRect.height;
        setBottomPosition(footerHeight + 24); // Footer height + 24px spacing
      } else {
        // If footer is not visible, use normal position
        setBottomPosition(24);
      }
    };

    // Check on initial load
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!currentUser) return null;

  const handleClick = () => {
    navigate("/blog/create");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-6 z-[9999] w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-2xl hover:shadow-primary-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Write new blog post"
      style={{ 
        position: 'fixed',
        bottom: `${bottomPosition}px`,
        transition: 'bottom 0.3s ease-in-out'
      }}
    >
      <BsPencilSquare className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 group-hover:rotate-12" />
    </button>
  );
};

export default FloatingWriteButton;


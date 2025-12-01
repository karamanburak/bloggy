import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import DeleteBlog from "../blog/DeleteBlog";
import EditBlogModal from "../blog/EditBlogModal";

const MyBlogsCard = ({
  _id,
  content,
  image,
  title,
  userId,
  createdAt,
  likes,
  countOfVisitors,
  categoryId,
}) => {
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const menuRef = useRef(null);

  const calcReadingTime = () => {
    if (!content) return;
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 150);
    setReadingTime(minutes >= 1 ? `${minutes} min read` : "Quick read");
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/blog/detail/${_id}`;
    navigator.clipboard.writeText(link);
    setMenuOpen(false);
  };

  const handleEditBlog = () => {
    setOpenEditModal(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    calcReadingTime();
  }, [content]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const previewText = stripHtml(content).substring(0, 120) + "...";

  return (
    <>
      <article className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900">
          <img
            src={image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Menu */}
          <div className="flex items-start justify-between mb-3 gap-2">
            <h3
              className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1 line-clamp-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() =>
                navigate(`/blog/detail/${_id}`, {
                  state: {
                    _id,
                    content,
                    image,
                    title,
                    userId,
                    createdAt,
                    likes,
                    countOfVisitors,
                    categoryId,
                    readingTime,
                  },
                })
              }
            >
              {title}
            </h3>
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="More options"
              >
                <BsThreeDots className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <IoIosLink className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBlog();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <HiPencil className="w-4 h-4" />
                    <span>Edit Blog</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <DeleteBlog id={_id} isMenuItem={true} />
                </div>
              )}
            </div>
          </div>

          {/* Preview Text */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {previewText}
          </p>

          {/* Author & Date */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-400 to-accent-500 flex-shrink-0">
                {currentUser?.image ? (
                  <img
                    src={currentUser.image}
                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xs">
                    {(currentUser?.firstName?.charAt(0) || "U").toUpperCase()}
                    {(currentUser?.lastName?.charAt(0) || "").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {currentUser?.firstName || "Unknown"} {currentUser?.lastName || ""}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/blog/detail/${_id}`, {
                  state: {
                    _id,
                    content,
                    image,
                    title,
                    userId,
                    createdAt,
                    likes,
                    countOfVisitors,
                    categoryId,
                    readingTime,
                  },
                });
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all duration-300"
            >
              <span className="text-xs font-semibold">Read</span>
              <MdArrowOutward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>

      {/* Edit Modal */}
      {openEditModal && (
        <EditBlogModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          blog={{ _id, content, image, title, userId, createdAt, likes, countOfVisitors, categoryId }}
          initialState={{
            title: title,
            content: content,
            image: image,
          }}
        />
      )}
    </>
  );
};

export default MyBlogsCard;

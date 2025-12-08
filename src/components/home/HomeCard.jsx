import React from "react";
import { useNavigate } from "react-router-dom";
import { HiHeart } from "react-icons/hi";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { HiEye } from "react-icons/hi";
import PageHeader from "./PageHeader";
import { toastWarnNotify } from "../../helper/ToastNotify";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { MdArrowOutward } from "react-icons/md";
import { formatDateTime } from "../../helper/formatDate";

const HomeCard = ({
  _id,
  content,
  image,
  title,
  userId,
  createdAt,
  likes,
  countOfVisitors,
  categoryId,
  comments,
}) => {
  const { postLike } = useBlogCall();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [readingTime, setReadingTime] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentUser && likes.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 150);
    if (minutes >= 1) {
      setReadingTime(`${minutes} min read`);
    }
  }, [likes, currentUser]);

  const handleLike = () => {
    if (!currentUser) {
      toastWarnNotify("Please sign in to like this blog");
      return;
    }

    postLike("blogs", _id);
  };

  const handleReadMore = () => {
    if (!currentUser) {
      toastWarnNotify("Please sign in to continue");
    } else {
      navigate(`/blog/detail/${_id}`, {
        state: {
          content,
          image,
          title,
          userId,
          createdAt,
          _id,
          likes,
          countOfVisitors,
          categoryId,
        },
      });
    }
  };

  const { image: userImage, firstName, lastName } = userId;

  const getParentId = (comment) => {
    if (!comment) return null;
    
    let parentId = comment.parentCommentId || comment.parentId || comment.parentComment || comment.replyTo || comment.parent;
    
    if (typeof parentId === 'string' && parentId.trim() !== '' && parentId !== 'null' && parentId !== 'undefined') {
      return parentId;
    }
    
    if (typeof parentId === 'object' && parentId !== null) {
      const extractedId = parentId._id || parentId.id || null;
      if (extractedId && typeof extractedId === 'string' && extractedId.trim() !== '') {
        return extractedId;
      }
    }
    
    if (comment.parentComment && typeof comment.parentComment === 'object') {
      return comment.parentComment._id || comment.parentComment.id || null;
    }
    
    return null;
  };

  const getParentCommentCount = () => {
    if (!Array.isArray(comments)) return 0;
    return comments.filter(comment => {
      const parentId = getParentId(comment);
      return !parentId;
    }).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <PageHeader text="Blogs" />
      <div className="min-h-[300px] flex flex-col md:flex-row p-4 bg-white rounded-xl shadow-lg">
        <div className="w-full md:w-1/2 flex flex-col justify-between my-6 p-4 rounded-xl order-2 md:order-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold">
                    {firstName?.charAt(0) || lastName?.charAt(0) || "A"}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  {firstName} {lastName}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(createdAt)}
                </span>
              </div>
            </div>
            <span className="text-sm font-bold mt-3 text-gray-700">
              {readingTime}
            </span>
          </div>
          <div className="mt-4">
            <p className="max-h-20 overflow-hidden text-ellipsis line-clamp-3 leading-relaxed text-gray-700">
              {content}
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${liked ? "text-red-500" : "text-gray-500"} hover:text-red-500 transition-colors`}
              >
                <HiHeart className="w-5 h-5" />
                <span>{likes?.length || 0}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-500">
                <HiChatBubbleLeftRight className="w-5 h-5" />
                <span>{getParentCommentCount()}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <HiEye className="w-5 h-5" />
                <span>{countOfVisitors || 0}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleReadMore}
              className="flex items-center gap-2 cursor-pointer font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Read More <MdArrowOutward className="mt-0.5" />
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center order-1 md:order-2">
          <img
            src={image}
            alt="blog"
            className="w-full h-[374px] object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeCard;

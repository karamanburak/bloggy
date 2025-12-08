import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import useBlogCall from "../../hooks/useBlogCall";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import { HiHeart } from "react-icons/hi";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const TrendBlogs = () => {
  const { getTrendsData } = useBlogCall();
  const { trendings } = useSelector((state) => state.blog);
  const navigate = useNavigate();

  useEffect(() => {
    getTrendsData();
  }, []);

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

  const getParentCommentCount = (comments) => {
    if (!Array.isArray(comments)) return 0;
    return comments.filter(comment => {
      const parentId = getParentId(comment);
      return !parentId;
    }).length;
  };

  const topTrendingBlogs = [...trendings]
    .sort((a, b) => b.countOfVisitors - a.countOfVisitors)
    .slice(0, 10);

  return (
    <div className="w-full max-w-[100vw]">
      <div>
        <h5 className="text-gray-100 font-semibold ml-10 md:ml-10 mb-2 flex items-center gap-2">
          <FaChartBar /> Trendings on Bloggy
        </h5>
        <hr className="border-gray-300" />
      </div>
      <div>
        <Swiper
          style={{
            "--swiper-pagination-bullet-inactive-color": "#999999",
          }}
          modules={[Autoplay, Pagination, Navigation, A11y]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500 }}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            576: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1400: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
        >
          {topTrendingBlogs.map((blog) => {
            const {
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
            } = blog;

            return (
              <SwiperSlide
                key={blog._id}
                className="flex justify-center h-[320px]"
              >
                <div
                  className="w-[220px] h-[280px] flex flex-col justify-between shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-white"
                >
                  <img
                    src={image}
                    alt={image}
                    className="h-[140px] w-full object-cover border-b border-gray-300"
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs mb-2 text-gray-600">
                      {categoryId.name}
                    </p>
                    <p className="text-xs font-bold h-10 overflow-hidden text-ellipsis text-center line-clamp-2">
                      {title}
                    </p>
                  </div>
                  <button
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
                        },
                      })
                    }
                    className="cursor-pointer flex justify-between items-center bg-gray-800 text-gray-100 rounded-b-lg px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <MdOutlineVisibility />
                        <sup>{countOfVisitors}</sup>
                      </span>
                      <span className="flex items-center gap-1">
                        <HiHeart className="text-base" />
                        <sup>{likes.length}</sup>
                      </span>
                      <span className="flex items-center gap-1">
                        <HiChatBubbleLeftRight className="text-base" />
                        <sup>{getParentCommentCount(comments)}</sup>
                      </span>
                    </div>
                    <span>
                      <MdArrowOutward />
                    </span>
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TrendBlogs;

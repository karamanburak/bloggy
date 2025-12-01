import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MyBlogsCard from "./MyBlogsCard";
import useBlogCall from "../../hooks/useBlogCall";
import loadingGif from "../../assets/loading.gif";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const MyBlogsContainer = ({ userId }) => {
  const { getUserBlogs, getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const userBlogs = blogs.filter((blog) => blog.userId._id === userId);

  useEffect(() => {
    getUserBlogs(userId);
    getBlogData("blogs");
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = userBlogs.slice(
    indexOfFirstBlog,
    indexOfFirstBlog + blogsPerPage
  );

  const totalPages = Math.ceil(userBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col items-center w-full">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <img src={loadingGif} alt="loading..." className="h-48 w-48" />
        </div>
      ) : userBlogs.length === 0 ? (
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            You haven't written any blogs yet. Start sharing your thoughts today!
          </h3>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          {currentBlogs?.map((blog) => (
            <MyBlogsCard key={blog._id} {...blog} />
          ))}
        </div>
      )}

      {userBlogs?.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center space-x-2"
          >
            <HiChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={index}
                onClick={() => paginate(page)}
                className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                  currentPage === page
                    ? "bg-primary-600 text-white shadow-lg"
                    : "border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex items-center space-x-2"
          >
            <span>Next</span>
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBlogsContainer;

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import MyBlogsCard from "./MyBlogsCard";
import useBlogCall from "../../hooks/useBlogCall";
import SkeletonLoader from "../global/SkeletonLoader";
import Pagination from "../global/Pagination";
import usePagination from "../../hooks/usePagination";
import { HiPencil } from "react-icons/hi";

const MyBlogsContainer = ({ userId }) => {
  const { getUserBlogs, getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);

  const userBlogs = blogs.filter((blog) => blog.userId._id === userId);

  useEffect(() => {
    getUserBlogs(userId);
    getBlogData("blogs");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const {
    currentPage,
    itemsPerPage,
    paginatedData: currentBlogs,
    totalPages,
    totalItems,
    handlePageChange,
  } = usePagination(userBlogs, 4, [userId]);

  return (
    <div className="flex flex-col items-center w-full">
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : userBlogs.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 mb-6">
            <HiPencil className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No Blogs Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            You haven't written any blogs yet. Start sharing your thoughts and ideas with the community!
          </p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentBlogs?.map((blog) => (
            <MyBlogsCard key={blog._id} {...blog} />
          ))}
        </div>
      )}

      {userBlogs?.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            showItemsPerPage={false}
            showInfo={false}
            itemName="blogs"
            variant="default"
          />
        </div>
      )}
    </div>
  );
};

export default MyBlogsContainer;

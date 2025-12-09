import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import MyBlogsCard from "./MyBlogsCard";
import useBlogCall from "../../hooks/useBlogCall";
import SkeletonLoader from "../global/SkeletonLoader";
import Pagination from "../global/Pagination";
import usePagination from "../../hooks/usePagination";
import { HiPencil } from "react-icons/hi";

const MyBlogsContainer = ({ userId, filterType = "published" }) => {
  const { getUserBlogs, getBlogData } = useBlogCall();
  const { blogs, loading } = useSelector((state) => state.blog);

  const userBlogs = useMemo(() => {
    const filtered = blogs.filter((blog) => {
      const userIdMatch = blog.userId?._id === userId || blog.userId === userId;
      if (!userIdMatch) return false;

      if (filterType === "published") {
        return blog.isPublish === true || blog.isPublish === undefined;
      } else if (filterType === "drafts") {
        return blog.isPublish === false;
      }
      return true;
    });
    return filtered;
  }, [blogs, userId, filterType]);

  useEffect(() => {
    getUserBlogs(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filterType]);

  const {
    currentPage,
    itemsPerPage,
    paginatedData: currentBlogs,
    totalPages,
    totalItems,
    handlePageChange,
  } = usePagination(userBlogs, 4, [userBlogs]);

  return (
    <div className="flex flex-col items-center w-full">
      {loading ? (
        <SkeletonLoader type="myBlogsList" count={4} variant="twoColumnsGap6" />
      ) : userBlogs.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            filterType === "drafts" 
              ? "bg-gradient-to-br from-amber-100 to-amber-200" 
              : "bg-gradient-to-br from-primary-100 to-accent-100"
          }`}>
            <HiPencil className={`w-10 h-10 ${
              filterType === "drafts" ? "text-amber-600" : "text-primary-600"
            }`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {filterType === "drafts" ? "No Drafts Yet" : "No Blogs Yet"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {filterType === "drafts" 
              ? "You don't have any draft blogs yet. Save your work as a draft to continue editing later!"
              : "You haven't written any blogs yet. Start sharing your thoughts and ideas with the community!"}
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

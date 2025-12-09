import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import EditBlogModal from "../components/blog/EditBlogModal";
import BlogHero from "../components/blog/BlogHero";
import BlogContent from "../components/blog/BlogContent";
import BlogDetailSkeleton from "../components/blog/BlogDetailSkeleton";
import { toastSuccessNotify } from "../helper/ToastNotify";

const CommentsSection = lazy(() => 
  import("../components/blog/CommentsSection").then(module => ({ default: module.default }))
);

const Detail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getBlogDetail,
    postLike,
    deleteComment,
    postCommentLike,
    postCommentDislike,
    refreshComments,
    incrementViewer,
  } = useBlogCall();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { blog, loading: blogLoading } = useSelector((state) => state.blog);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.category);
  const { getCategory } = useCategoryCall();

  const isLoading = blogLoading || categoriesLoading;
  const blogId = id || state?._id;
  
  const blogData = useMemo(() => {
    if (blog?._id === blogId) {
      return blog;
    }
    if (state?._id === blogId) {
      return state;
    }
    return null;
  }, [blog, blogId, state]);

  const isBlogDataValid = useMemo(() => {
    return blogData && blogData._id === blogId;
  }, [blogData, blogId]);

  const {
    content,
    image,
    createdAt,
    userId,
    title,
    _id: blogDataId,
    categoryId,
    countOfVisitors,
  } = isBlogDataValid ? blogData : {};

  const _id = blogDataId || blogId;
  
  const [localLikes, setLocalLikes] = useState(() => {
    if (blogData?.likes && Array.isArray(blogData.likes)) {
      return blogData.likes;
    }
    return [];
  });

  // Update localLikes only when blogData.likes actually changes
  useEffect(() => {
    if (isBlogDataValid && blogData?.likes && Array.isArray(blogData.likes)) {
      setLocalLikes(blogData.likes);
    } else if (!isBlogDataValid) {
      setLocalLikes([]);
    }
  }, [isBlogDataValid, blogData?.likes]);

  const liked = useMemo(() => {
    return currentUser ? localLikes.includes(currentUser._id) : false;
  }, [currentUser, localLikes]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const isCurrentUserOwner = currentUser && userId?._id === currentUser._id;
  const viewerIncremented = useRef(false);
  const lastBlogIdRef = useRef(null);
  const hasFetchedRef = useRef(false);

  // Reset flags when blogId changes
  useEffect(() => {
    if (blogId && lastBlogIdRef.current !== blogId) {
      viewerIncremented.current = false;
      hasFetchedRef.current = false;
      lastBlogIdRef.current = blogId;
    }
  }, [blogId]);

  // Memoize incrementViewer callback to prevent unnecessary re-renders
  const handleIncrementViewer = useCallback(() => {
    if (!blogId || viewerIncremented.current) return;

    const storageKey = `blog_viewed_${blogId}`;
    const hasViewed = sessionStorage.getItem(storageKey);

    if (isBlogDataValid && blog && blog._id === blogId && !hasViewed) {
      sessionStorage.setItem(storageKey, "true");
      viewerIncremented.current = true;
      incrementViewer("blogs", blogId);
    }
  }, [blogId, isBlogDataValid, blog, incrementViewer]);

  useEffect(() => {
    if (!blogId) return;

    // Only fetch categories if they're not already loaded (avoid unnecessary calls)
    if (!categories.length && !categoriesLoading) {
      getCategory("categories");
    }

    const shouldFetch = !hasFetchedRef.current && (!isBlogDataValid || blog?._id !== blogId);
    if (shouldFetch) {
      hasFetchedRef.current = true;
      getBlogDetail("blogs", blogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  useEffect(() => {
    if (isBlogDataValid && blog && blog._id === blogId) {
      handleIncrementViewer();
    }
  }, [isBlogDataValid, blog, blogId, handleIncrementViewer]);

  const handleLike = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    postLike("blogs", _id);
    setLocalLikes((prevLikes) => 
      liked 
        ? prevLikes.filter((id) => id !== currentUser._id) 
        : [...prevLikes, currentUser._id]
    );
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/blog/detail/${_id}`;
    try {
      await navigator.clipboard.writeText(link);
      toastSuccessNotify("Link copied to clipboard! 📋");
    } catch (err) {
      // Error copying link
    }
  };

  const commentsCount = useMemo(() => {
    if (!isBlogDataValid || !blog?.comments || !Array.isArray(blog.comments)) {
      return 0;
    }
    return blog.comments.filter(
      (c) =>
        c &&
        typeof c === "object" &&
        !c.parentCommentId &&
        !c.parentId &&
        !c.parentComment &&
        !c.replyTo
    ).length;
  }, [isBlogDataValid, blog?.comments]);

  if (!blogId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Blog not found</p>
      </div>
    );
  }


  if (isLoading || !isBlogDataValid || (blog?._id && blog._id !== blogId)) {
    return <BlogDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      <BlogHero
        image={image}
        title={title}
        userId={userId}
        createdAt={createdAt}
        content={content}
        likes={localLikes}
        liked={liked}
        countOfVisitors={isBlogDataValid ? (blog?.countOfVisitors ?? countOfVisitors ?? 0) : 0}
        commentsCount={commentsCount}
        isCurrentUserOwner={isCurrentUserOwner}
        onLike={handleLike}
        onCopyLink={handleCopyLink}
        onEdit={() => setOpenEditModal(true)}
        blogId={_id}
      />

      <BlogContent content={content} title={title} image={image} blogId={_id} />

      <div className="w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="mt-16 pt-12 border-t border-gray-200/50"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/4"></div><div className="h-20 bg-gray-200 rounded"></div></div></div>}>
            <CommentsSection
              blog={blog}
              blogId={_id}
              currentUser={currentUser}
              onDeleteComment={deleteComment}
              onLikeComment={postCommentLike}
              onDislikeComment={postCommentDislike}
              onRefreshComments={refreshComments}
            />
          </Suspense>
        </div>
      </div>

      {openEditModal && (
        <EditBlogModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          blog={blogData}
          initialState={{
            title: title,
            content: content,
            image: image,
            categoryId: categoryId?._id || categoryId || "",
            isPublish: blog?.isPublish ?? blogData?.isPublish ?? true,
          }}
        />
      )}
    </div>
  );
};

export default Detail;

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useBlogCall from "../hooks/useBlogCall";
import useCategoryCall from "../hooks/useCategoryCall";
import EditBlogModal from "../components/blog/EditBlogModal";
import BlogHero from "../components/blog/BlogHero";
import BlogContent from "../components/blog/BlogContent";
import CommentsSection from "../components/blog/CommentsSection";
import BlogDetailSkeleton from "../components/blog/BlogDetailSkeleton";
import { toastSuccessNotify } from "../helper/ToastNotify";
import { getBlogDetailSuccess } from "../features/blogSlice";

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
  const blogId = id || state?._id || blog?._id;
  const blogData = blog?._id === blogId ? blog : state || (blogId === blog?._id ? blog : null);

  const {
    content,
    image,
    createdAt,
    userId,
    title,
    _id: blogDataId,
    categoryId,
    countOfVisitors,
  } = blogData || {};

  const _id = blogDataId || blogId;
  
  const [localLikes, setLocalLikes] = useState(() => {
    if (blog?._id === _id && blog?.likes) {
      return blog.likes;
    }
    return blogData?.likes || [];
  });

  useEffect(() => {
    if (blog?._id === _id && blog?.likes) {
      setLocalLikes(blog.likes);
    } else if (blogData?.likes) {
      setLocalLikes(blogData.likes);
    }
  }, [blog, _id, blogData]);

  const liked = useMemo(() => {
    return currentUser ? localLikes.includes(currentUser._id) : false;
  }, [currentUser, localLikes]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const isCurrentUserOwner = currentUser && userId?._id === currentUser._id;
  const viewerIncremented = useRef(false);

  useEffect(() => {
    const targetId = _id || blogId;
    if (!targetId) return;

    if (!categories.length) {
      getCategory("categories");
    }

    if (!blogData && targetId) {
      getBlogDetail("blogs", targetId);
      return;
    }

    if (blogData && blog?._id !== targetId) {
      refreshComments(targetId)
        .then((comments) => {
          if (blogData && blogData._id === targetId) {
            dispatch(
              getBlogDetailSuccess({
                data: {
                  ...blogData,
                  comments: comments || [],
                },
              })
            );
          }
        })
        .catch(() => {
          getBlogDetail("blogs", targetId);
        });
    } else if (!blogData && targetId) {
      getBlogDetail("blogs", targetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId, _id, blogData, categories.length, getCategory, getBlogDetail, refreshComments, dispatch]);

  useEffect(() => {
    const targetId = _id || blogId;
    if (!targetId || viewerIncremented.current) return;

    const storageKey = `blog_viewed_${targetId}`;
    const hasViewed = sessionStorage.getItem(storageKey);

    if (blog && blog._id === targetId && !hasViewed && !viewerIncremented.current) {
      sessionStorage.setItem(storageKey, "true");
      viewerIncremented.current = true;
      incrementViewer("blogs", targetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog, blogId, _id, incrementViewer]);

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
      toastSuccessNotify("Link copied to clipboard!");
    } catch (err) {
      // Error copying link
    }
  };

  const commentsCount =
    blog?.comments?.filter(
      (c) =>
        c &&
        typeof c === "object" &&
        !c.parentCommentId &&
        !c.parentId &&
        !c.parentComment &&
        !c.replyTo
    ).length || 0;

  if ((isLoading && !blogData) || (blogId && !blogData && !isLoading)) {
    return <BlogDetailSkeleton />;
  }

  if (!blogData && !blogId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Blog not found</p>
      </div>
    );
  }

  if (!blogData && blogId) {
    return <BlogDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <BlogHero
        image={image}
        title={title}
        userId={userId}
        createdAt={createdAt}
        content={content}
        likes={localLikes}
        liked={liked}
        countOfVisitors={blog?.countOfVisitors ?? countOfVisitors ?? 0}
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
          <CommentsSection
            blog={blog}
            blogId={_id}
            currentUser={currentUser}
            onDeleteComment={deleteComment}
            onLikeComment={postCommentLike}
            onDislikeComment={postCommentDislike}
            onRefreshComments={refreshComments}
          />
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

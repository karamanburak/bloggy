const SkeletonLoader = ({ type = "card", count = 1, variant, className }) => {
  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute top-4 left-4 w-20 h-6 bg-white/50 rounded-full"></div>
        <div className="absolute top-4 right-4 w-16 h-6 bg-white/50 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const BlogCardSkeleton = () => (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {/* Category Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-20 h-7 bg-white/50 backdrop-blur-sm rounded-full"></div>
        </div>
        {/* Reading Time - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-24 h-7 bg-black/30 backdrop-blur-sm rounded-full"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-3 min-h-[3.5rem] space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Preview Text */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Author & Date */}
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="h-4 w-4 bg-gray-200 rounded shrink-0"></div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="h-4 w-4 bg-gray-200 rounded shrink-0"></div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="h-4 w-4 bg-gray-200 rounded shrink-0"></div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-9 w-20 bg-gray-200 rounded-lg shrink-0"></div>
        </div>
      </div>
    </div>
  );

  const MyBlogsCardSkeleton = () => (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"></div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Menu */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0"></div>
        </div>

        {/* Preview Text */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Author & Date Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-lg shrink-0"></div>
        </div>
      </div>
    </div>
  );

  const NewsCardSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 animate-pulse h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
        {/* Source Badge */}
        <div className="absolute top-3 left-3">
          <div className="w-24 h-6 bg-white/50 backdrop-blur-sm rounded-full"></div>
        </div>
        {/* Time Badge */}
        <div className="absolute top-3 right-3">
          <div className="w-20 h-6 bg-black/30 backdrop-blur-sm rounded-full"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow min-h-0">
        {/* Date */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Title */}
        <div className="mb-3 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Description */}
        <div className="mb-4 space-y-2 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="h-9 w-32 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const BlogListSkeleton = ({ variant = "default", containerClassName, cardType = "blogCard" }) => {
    const gridClasses = {
      default: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
      threeColumns: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
      threeColumnsGap6: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      twoColumns: "grid grid-cols-1 md:grid-cols-2 gap-8",
      twoColumnsGap6: "grid grid-cols-1 md:grid-cols-2 gap-6",
    };

    const gridClass = gridClasses[variant] || gridClasses.default;
    const containerClass = containerClassName 
      ? `${gridClass} ${containerClassName}` 
      : gridClass;

    const CardComponent = cardType === "myBlogsCard" ? MyBlogsCardSkeleton : BlogCardSkeleton;

    return (
      <div className={containerClass}>
        {Array.from({ length: count }).map((_, index) => (
          <CardComponent key={index} />
        ))}
      </div>
    );
  };

  const TextSkeleton = ({ lines = 3 }) => (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? "w-3/4" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  );

  const CircleSkeleton = ({ size = "w-12 h-12" }) => (
    <div className={`${size} rounded-full bg-gray-200 animate-pulse`}></div>
  );

  switch (type) {
    case "card":
      return <CardSkeleton />;
    case "blogCard":
      return <BlogCardSkeleton />;
    case "myBlogsCard":
      return <MyBlogsCardSkeleton />;
    case "blogList":
      return <BlogListSkeleton variant={variant} containerClassName={className} cardType="blogCard" />;
    case "newsCard":
      return <NewsCardSkeleton />;
    case "list":
      return <BlogListSkeleton variant={variant} containerClassName={className} cardType="blogCard" />;
    case "myBlogsList":
      return <BlogListSkeleton variant={variant} containerClassName={className} cardType="myBlogsCard" />;
    case "text":
      return <TextSkeleton lines={count} />;
    case "circle":
      return <CircleSkeleton size={count} />;
    default:
      return <CardSkeleton />;
  }
};

export default SkeletonLoader;


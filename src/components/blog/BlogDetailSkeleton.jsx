const BlogDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {/* Hero Image Skeleton */}
      <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute top-6 left-6 w-24 h-10 bg-white/20 rounded-lg"></div>
        <div className="absolute top-6 right-6 w-32 h-10 bg-white/20 rounded-full"></div>
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-12">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-white/20"></div>
              <div className="space-y-2">
                <div className="h-5 w-48 bg-white/20 rounded"></div>
                <div className="h-4 w-32 bg-white/20 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-12 bg-white/20 rounded w-3/4"></div>
              <div className="h-12 bg-white/20 rounded w-1/2"></div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="h-6 w-16 bg-white/20 rounded"></div>
              <div className="h-6 w-16 bg-white/20 rounded"></div>
              <div className="h-6 w-16 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 mb-12">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 py-4 border-b border-gray-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;


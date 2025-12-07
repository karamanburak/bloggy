import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  showItemsPerPage = false,
  showInfo = true,
  itemName = "items",
  variant = "default", // "default" or "admin"
}) => {
  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("ellipsis");
      }
    }
    return pages;
  };

  const isAdminVariant = variant === "admin";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
      isAdminVariant 
        ? "bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg"
        : ""
    }`}>
      {showInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isAdminVariant ? (
            <>
              Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span> total {itemName}
              {totalItems > 0 && (
                <span className="ml-2">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </>
          ) : (
            <>
              Showing {startIndex + 1} to {endIndex} of {totalItems} {itemName}
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                handlePageChange(1);
              }}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isAdminVariant
                  ? currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg"
                  : currentPage === 1
                  ? "p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  : "p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
              }`}
              aria-label="Previous page"
            >
              <HiChevronLeft className={isAdminVariant ? "w-5 h-5" : "w-6 h-6"} />
              {isAdminVariant && <span>Previous</span>}
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === "ellipsis") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${
                      isAdminVariant
                        ? `px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`
                        : `w-10 h-10 rounded-lg font-semibold transition-all hover:scale-105 ${
                            currentPage === page
                              ? "bg-primary-600 text-white shadow-lg"
                              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isAdminVariant
                  ? currentPage === totalPages
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg"
                  : currentPage === totalPages
                  ? "p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  : "p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
              }`}
              aria-label="Next page"
            >
              {isAdminVariant && <span>Next</span>}
              <HiChevronRight className={isAdminVariant ? "w-5 h-5" : "w-6 h-6"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;


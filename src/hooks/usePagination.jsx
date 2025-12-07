import { useState, useEffect, useMemo } from "react";

const usePagination = (data, itemsPerPageDefault = 10, dependencies = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const paginatedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    paginatedData,
    totalPages,
    totalItems: Array.isArray(data) ? data.length : 0,
    handlePageChange,
    handleItemsPerPageChange,
  };
};

export default usePagination;


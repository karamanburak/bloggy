/**
 * Formats a date string to European format (DD/MM/YYYY) with 24-hour time format
 * @param {string|Date} date - The date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Whether to include time (default: false)
 * @param {boolean} options.includeSeconds - Whether to include seconds (default: false)
 * @param {string} options.monthFormat - 'long', 'short', or 'numeric' (default: 'short')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const {
    includeTime = false,
    includeSeconds = false,
    monthFormat = "short",
  } = options;

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const day = dateObj.getDate();
  const monthNames = {
    long: dateObj.toLocaleDateString("en-US", { month: "long" }),
    short: dateObj.toLocaleDateString("en-US", { month: "short" }),
    numeric: (dateObj.getMonth() + 1).toString(),
  };
  const month = monthNames[monthFormat] || monthNames.short;
  const year = dateObj.getFullYear();

  let formattedDate = "";
  if (monthFormat === "numeric") {
    formattedDate = `${day}/${month}/${year}`;
  } else {
    formattedDate = `${day} ${month} ${year}`;
  }

  if (includeTime) {
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    let timeString = `${hours}:${minutes}`;
    
    if (includeSeconds) {
      const seconds = dateObj.getSeconds().toString().padStart(2, "0");
      timeString += `:${seconds}`;
    }
    
    formattedDate += ` ${timeString}`;
  }

  return formattedDate;
};

/**
 * Formats a date to show only date without time (DD/MM/YYYY)
 * @param {string|Date} date - The date to format
 * @param {string} monthFormat - 'long', 'short', or 'numeric' (default: 'numeric')
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (date, monthFormat = "numeric") => {
  return formatDate(date, { monthFormat });
};

/**
 * Formats a date with time (DD/MM/YYYY HH:MM)
 * @param {string|Date} date - The date to format
 * @param {boolean} includeSeconds - Whether to include seconds (default: false)
 * @returns {string} Formatted date string with time
 */
export const formatDateTime = (date, includeSeconds = false) => {
  return formatDate(date, { includeTime: true, includeSeconds });
};


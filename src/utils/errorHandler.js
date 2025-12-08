import { toastErrorNotify } from "../helper/ToastNotify";

/**
 * Centralized error handler for API errors
 * @param {Error} error - The error object
 * @param {Object} options - Error handling options
 * @param {string} options.defaultMessage - Default error message
 * @param {boolean} options.showToast - Whether to show toast notification
 * @param {Function} options.onError - Custom error callback
 * @returns {Object} Error information
 */
export const handleApiError = (error, options = {}) => {
  const {
    defaultMessage = "Something went wrong. Please try again.",
    showToast = true,
    onError = null,
  } = options;

  let errorMessage = defaultMessage;
  let statusCode = null;
  let errorData = null;

  // Extract error information
  if (error?.response) {
    // Server responded with error status
    statusCode = error.response.status;
    errorData = error.response.data;

    // Try to extract meaningful error message
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      errorMessage = errorData.error;
    } else if (typeof errorData === "string") {
      errorMessage = errorData;
    }
  } else if (error?.request) {
    // Request was made but no response received
    errorMessage = "Connection error. Please check your internet connection and try again.";
  } else if (error?.message) {
    // Error in request setup
    errorMessage = error.message;
  }

  // Show toast notification if enabled
  if (showToast) {
    toastErrorNotify(errorMessage);
  }

  // Call custom error handler if provided
  if (onError && typeof onError === "function") {
    onError(error, { message: errorMessage, statusCode, errorData });
  }

  return {
    message: errorMessage,
    statusCode,
    errorData,
    originalError: error,
  };
};

/**
 * Retry mechanism for API calls
 * @param {Function} apiCall - The API function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.delay - Delay between retries in ms
 * @param {Function} options.shouldRetry - Function to determine if should retry
 * @returns {Promise} API call result
 */
export const retryApiCall = async (apiCall, options = {}) => {
  const {
    maxRetries = 3,
    delay = 1000,
    shouldRetry = (error) => {
      // Retry on network errors or 5xx server errors
      if (!error?.response) return true;
      const status = error.response.status;
      return status >= 500 && status < 600;
    },
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      lastError = error;

      // Don't retry if it's the last attempt or shouldn't retry
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error?.response && error?.request;
};

/**
 * Check if error is a timeout error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isTimeoutError = (error) => {
  return error?.code === "ECONNABORTED" || error?.message?.includes("timeout");
};

/**
 * Check if error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};


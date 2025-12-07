import { useState } from "react";
import { useSelector } from "react-redux";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";

const useImageUpload = () => {
  const { token } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file) => {
    if (!file) {
      toastErrorNotify("Please select an image file to upload");
      return null;
    }

    // Check if user is authenticated
    if (!token) {
      toastErrorNotify("Please sign in to upload images");
      return null;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toastErrorNotify("Please select a valid image file (JPG, PNG, GIF, etc.)");
      return null;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toastErrorNotify("Image size must be less than 10MB. Please choose a smaller file.");
      return null;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Get upload URL from environment or use default backend endpoint
      const baseUrl = import.meta.env.VITE_BASE_URL || "";
      const uploadUrl = import.meta.env.VITE_BLOB_UPLOAD_URL || `${baseUrl}api/upload`;

      console.log("Upload URL:", uploadUrl); // For debugging

      // Prepare headers with authentication token
      const headers = {};
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      // Upload to backend endpoint (which handles Vercel Blob Store)
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: formData,
        // Don't set Content-Type header, browser will set it with boundary
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Upload failed: ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        console.error("Upload failed:", response.status, errorMessage);
        
        // Special message for 404 error
        if (response.status === 404) {
          toastErrorNotify("Upload service unavailable. Please try again later.");
        } else {
          toastErrorNotify(errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUploadProgress(100);
      toastSuccessNotify("Image uploaded successfully! ✨");
      return data.url; // Return the uploaded image URL
    } catch (error) {
      console.error("Upload error:", error);
      toastErrorNotify("Image upload failed. Please check your connection and try again.");
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadImage,
    uploading,
    uploadProgress,
  };
};

export default useImageUpload;


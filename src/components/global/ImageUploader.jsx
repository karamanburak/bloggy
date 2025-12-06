import { useState, useRef } from "react";
import {
  HiCloudUpload,
  HiX,
  HiFolder,
  HiLink,
  HiPhotograph,
} from "react-icons/hi";
import useImageUpload from "../../hooks/useImageUpload";

const ImageUploader = ({
  onImageUploaded,
  currentImageUrl = "",
  label = "Upload Image",
  maxSizeMB = 10,
  accept = "image/*",
}) => {
  const { uploadImage, uploading, uploadProgress } = useImageUpload();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("drag"); // "drag", "file", "url"
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [preview, setPreview] = useState(currentImageUrl);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (imageUrlInput.trim()) {
      setPreview(imageUrlInput.trim());
      if (onImageUploaded) {
        onImageUploaded(imageUrlInput.trim());
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview("");
    if (onImageUploaded) {
      onImageUploaded("");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative group rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 md:h-64 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("drag")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "drag"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <HiCloudUpload className="w-4 h-4" />
            <span>Drag & Drop</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("file")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "file"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <HiFolder className="w-4 h-4" />
            <span>File</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "url"
              ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <HiLink className="w-4 h-4" />
            <span>URL</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* Drag & Drop Tab */}
        {activeTab === "drag" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
              isDragging
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
            } ${uploading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              {uploading ? (
                <>
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <HiCloudUpload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isDragging
                        ? "Drop image here"
                        : "Drag & drop image here"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Or click to select file (max {maxSizeMB}MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* File Tab */}
        {activeTab === "file" && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={handleFileSelectClick}
              disabled={uploading}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                {uploading ? (
                  <>
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploading... {uploadProgress}%
                    </p>
                  </>
                ) : (
                  <>
                    <HiFolder className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to select image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, GIF up to {maxSizeMB}MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </button>
          </div>
        )}

        {/* URL Tab */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiPhotograph className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && imageUrlInput.trim()) {
                    e.preventDefault();
                    handleUrlSubmit(e);
                  }
                }}
                className="input-field pl-10 w-full"
                placeholder="https://example.com/image.jpg"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="btn-primary w-full"
              disabled={!imageUrlInput.trim()}
            >
              Use URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;


import { useState, useRef, useEffect } from "react";
import useAuthCall from "../../hooks/useAuthCall";
import ImageUploader from "../global/ImageUploader";
import {
  HiX,
  HiUser,
  HiMail,
  HiPhotograph,
  HiPencil,
  HiLocationMarker,
  HiLockClosed,
  HiCloudUpload,
  HiLink,
  HiFolder,
} from "react-icons/hi";
import blogRatings from "../../assets/blog-video.mp4";

const UpdateProfileModal = ({
  open,
  handleClose,
  image,
  username,
  email,
  bio,
  city,
  firstName,
  lastName,
  _id,
}) => {
  const { updateUser } = useAuthCall();
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageEditModal, setShowImageEditModal] = useState(false);

  const [info, setInfo] = useState({
    username: username || "",
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    image: image || "",
    bio: bio || "",
    city: city || "",
    password: "",
  });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleImageUploaded = (url) => {
    if (url) {
      setInfo({ ...info, image: url });
      setImagePreview(url);
      setShowImageEditModal(false);
    }
  };

  useEffect(() => {
    if (open && image) {
      setImagePreview(image);
      setInfo((prev) => ({ ...prev, image: image }));
    }
  }, [open, image]);

  useEffect(() => {
    if (!open) {
      setShowImageEditModal(false);
    }
  }, [open]);

  const handleEditImageClick = (e) => {
    e.stopPropagation();
    setShowImageEditModal(true);
  };

  const handleImageEditClose = () => {
    setShowImageEditModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(info, _id);
    handleClose();
  };

  const updateFormField = [
    {
      id: "username",
      name: "username",
      label: "Username",
      type: "text",
      icon: HiUser,
      required: true,
    },
    {
      id: "firstName",
      name: "firstName",
      label: "First Name",
      type: "text",
      icon: HiUser,
      required: true,
    },
    {
      id: "lastName",
      name: "lastName",
      label: "Last Name",
      type: "text",
      icon: HiUser,
      required: true,
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      icon: HiMail,
      required: true,
    },
    {
      id: "bio",
      name: "bio",
      label: "Biography",
      type: "textarea",
      icon: HiPencil,
      required: false,
    },
    {
      id: "city",
      name: "city",
      label: "City",
      type: "text",
      icon: HiLocationMarker,
      required: false,
    },
    {
      id: "password",
      name: "password",
      label: "Confirm Password (Required for update)",
      type: "password",
      icon: HiLockClosed,
      required: true,
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background Video */}
      <div className="fixed inset-0 z-0" onClick={handleClose}>
        <video
          src={blogRatings}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/90" />
      </div>

      {/* Modal */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Edit Profile
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Image Section - Top */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl">
                  {info.image || imagePreview ? (
                    <img
                      src={info.image || imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold">
                      {firstName?.charAt(0).toUpperCase() || ""}
                      {lastName?.charAt(0).toUpperCase() || ""}
                    </div>
                  )}
                </div>
                {/* Edit Icon Button */}
                <button
                  type="button"
                  onClick={handleEditImageClick}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-500/50 z-20"
                  aria-label="Edit profile image"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Image Edit Modal */}
          {showImageEditModal && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={handleImageEditClose}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Edit Profile Image
                  </h3>
                  <button
                    onClick={handleImageEditClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4">
                  <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
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
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <ImageUploader
                    onImageUploaded={handleImageUploaded}
                    currentImageUrl={info.image || imagePreview}
                    label=""
                    maxSizeMB={10}
                  />
                  <button
                    type="button"
                    onClick={handleImageEditClose}
                    className="btn-secondary w-full mt-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {updateFormField.map((field) => {
                const IconComponent = field.icon;
                const isTextarea = field.type === "textarea";

                return (
                  <div
                    key={field.id}
                    className={isTextarea ? "md:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconComponent className="h-5 w-5 text-gray-400" />
                      </div>
                      {isTextarea ? (
                        <textarea
                          id={field.id}
                          name={field.name}
                          value={info[field.name]}
                          onChange={handleChange}
                          rows={4}
                          autoComplete="off"
                          className={`input-field pl-10 resize-none ${
                            field.required && !info[field.name]
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          value={info[field.name]}
                          onChange={handleChange}
                          autoComplete="off"
                          required={field.required}
                          className={`input-field pl-10 ${
                            field.required && !info[field.name]
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                    {field.required && !info[field.name] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        This field is required
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;

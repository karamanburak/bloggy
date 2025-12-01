import { useState, useRef, useEffect } from "react";
import useAuthCall from "../../hooks/useAuthCall";
import {
  HiX,
  HiUser,
  HiMail,
  HiPhotograph,
  HiPencil,
  HiLocationMarker,
  HiLockClosed,
  HiCloudUpload,
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
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setInfo({ ...info, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
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

  const handleImageUrlChange = (e) => {
    setInfo({ ...info, image: e.target.value });
    setImagePreview(e.target.value);
  };

  useEffect(() => {
    if (open && image) {
      setImagePreview(image);
    }
  }, [open, image]);

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
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
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

              {/* Image Upload Section */}
              <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Image
              </label>
              
              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
                  isDragging
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <HiCloudUpload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isDragging
                        ? "Drop image here"
                        : "Drag & drop image here or click to select"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Or enter image URL below
                    </p>
                  </div>
                </div>
              </div>

              {/* Image URL Input */}
              <div className="mt-4">
                <label
                  htmlFor="image-url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiPhotograph className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="image-url"
                    name="image"
                    type="url"
                    value={info.image}
                    onChange={handleImageUrlChange}
                    autoComplete="off"
                    className="input-field pl-10"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Preview Image */}
              {(info.image || imagePreview) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </label>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                    <img
                      src={info.image || imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
              </div>
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

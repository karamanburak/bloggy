import React, { useState } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

const DeleteBlog = ({ id, isMenuItem = false }) => {
  const [open, setOpen] = useState(false);
  const { deleteBlog } = useBlogCall();
  const navigate = useNavigate();

  const handleDelete = () => {
    setOpen(false);
    deleteBlog("blogs", id);
    navigate(-1);
  };

  if (isMenuItem) {
    return (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Delete Blog</span>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this blog post? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="flex gap-2 justify-center lg:justify-end">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
      >
        <FiTrash2 className="w-4 h-4" />
        <span>Delete Blog</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteBlog;

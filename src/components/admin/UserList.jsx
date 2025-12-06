import { useState, useEffect } from "react";
import useAdminCall from "../../hooks/useAdminCall";
import { HiUser, HiMail, HiCalendar, HiLocationMarker } from "react-icons/hi";
import { FaTrash, FaEdit, FaUserShield } from "react-icons/fa";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import { toastSuccessNotify } from "../../helper/ToastNotify";

const UserList = () => {
  const { getAllUsers, deleteUser, updateUser } = useAdminCall();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    isAdmin: false,
    isActive: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(Array.isArray(result.data) ? result.data : []);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId);
      if (result.success) {
        toastSuccessNotify("User deleted successfully");
        loadUsers();
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.username || "",
      isAdmin: user.isAdmin || user.role === "admin",
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
  };

  const handleSaveEdit = async () => {
    const result = await updateUser(editingUser, editForm);
    if (result.success) {
      toastSuccessNotify("User updated successfully");
      setEditingUser(null);
      loadUsers();
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      isAdmin: false,
      isActive: true,
    });
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const result = await updateUser(userId, { isActive: newStatus });
    if (result.success) {
      toastSuccessNotify(
        `User ${newStatus ? "activated" : "deactivated"} successfully`
      );
      loadUsers();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700 shadow-lg">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "table"
                ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-label="Table View"
            title="Table View"
          >
            <HiViewList className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-label="Grid View"
            title="Grid View"
          >
            <HiViewGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users Table View */}
      {viewMode === "table" && (
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold">User</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Registration Date</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
              <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {editingUser === user._id ? (
                    <>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, firstName: e.target.value })
                            }
                            placeholder="First Name"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, lastName: e.target.value })
                            }
                            placeholder="Last Name"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-6 py-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.isAdmin}
                            onChange={(e) =>
                              setEditForm({ ...editForm, isAdmin: e.target.checked })
                            }
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Admin
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.isActive}
                            onChange={(e) =>
                              setEditForm({ ...editForm, isActive: e.target.checked })
                            }
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Active
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span>
                                {user.firstName?.charAt(0)?.toUpperCase()}
                                {user.lastName?.charAt(0)?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                          <HiMail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <HiCalendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString("en-US")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isAdmin || user.role === "admin" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-600 to-accent-600 text-white">
                            <FaUserShield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive !== false ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user._id, user.isActive !== false)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive !== false
                                ? "text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            }`}
                            aria-label={user.isActive !== false ? "Deactivate" : "Activate"}
                            title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                          >
                            {user.isActive !== false ? (
                              <HiLocationMarker className="w-4 h-4" />
                            ) : (
                              <HiUser className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Users Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {editingUser === user._id ? (
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, firstName: e.target.value })
                        }
                        placeholder="First Name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        placeholder="Last Name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="Email"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    />
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.isAdmin}
                          onChange={(e) =>
                            setEditForm({ ...editForm, isAdmin: e.target.checked })
                          }
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Admin
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.isActive}
                          onChange={(e) =>
                            setEditForm({ ...editForm, isActive: e.target.checked })
                          }
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Active
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {user.firstName?.charAt(0)?.toUpperCase()}
                              {user.lastName?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            @{user.username}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                          <HiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <HiCalendar className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString("en-US")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {user.isAdmin || user.role === "admin" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-600 to-accent-600 text-white">
                            <FaUserShield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            User
                          </span>
                        )}
                        {user.isActive !== false ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          aria-label="Edit"
                          title="Edit User"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user._id, user.isActive !== false)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive !== false
                              ? "text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                          aria-label={user.isActive !== false ? "Deactivate" : "Activate"}
                          title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                        >
                          {user.isActive !== false ? (
                            <HiLocationMarker className="w-4 h-4" />
                          ) : (
                            <HiUser className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label="Delete"
                          title="Delete User"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Showing {filteredUsers.length} total users
      </div>
    </div>
  );
};

export default UserList;


import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Utility: Display messages and auto-clear
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `https://captn.onrender.com/api/admin/users?page=${page}&limit=${itemsPerPage}`,
        config
      );
      setUsers(response.data.data || response.data);
    } catch (err) {
      showMessage("error", "Failed to fetch users. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  // Update user
  const handleUpdate = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `https://captn.onrender.com/api/admin/users/${editingUserId}`,
        formData,
        config
      );
      showMessage("success", "User updated successfully!");
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      showMessage("error", "Failed to update user. Please try again.", err);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(
        `https://captn.onrender.com/api/admin/users/${userId}`,
        config
      );
      showMessage("success", "User deleted successfully!");
      fetchUsers();
    } catch (err) {
      showMessage("error", "Failed to delete user. Please try again.", err);
    }
  };

  // Pagination controls
  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {message.text && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {editingUserId === user._id ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {editingUserId === user._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 text-white px-4 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="bg-gray-500 text-white px-4 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-4 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-1 rounded"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={nextPage}
          className="bg-gray-500 text-white px-4 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

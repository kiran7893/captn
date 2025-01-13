// src/components/Dashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        config
      );
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching users");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}`,
        formData,
        config
      );

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || "Error updating user");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(
          `http://localhost:5000/api/admin/users/${userId}`,
          config
        );

        fetchUsers();
      } catch (error) {
        setError(error.response?.data?.error || "Error deleting user");
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
                Role
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 border-b border-gray-300">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {editingUser === user._id ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {editingUser === user._id ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

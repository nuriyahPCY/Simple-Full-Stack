import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/users/${id}`);
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  const handleEdit = async (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setEditUser(userToEdit);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/users/${editUser.id}`,
        editUser
      );
      const updatedUsers = users.map((user) =>
        user.id === editUser.id ? response.data : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditUser(null);
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredUsers(users);
    } else {
      const result = users.filter((user) => user.id === parseInt(searchId, 10));
      setFilteredUsers(result);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User List</h1>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}
      {!isLoading && !error && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Is Active</th>
              <th>Date Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.is_active ? "Yes" : "No"}</td>
                <td>{new Date(user.date_joined).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)} style={styles.editButton}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editUser && (
        <div style={styles.editForm}>
          <h2>Edit User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div style={styles.formGroup}>
              <label>Username: </label>
              <input
                type="text"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label>Email: </label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label>First Name: </label>
              <input
                type="text"
                value={editUser.first_name}
                onChange={(e) =>
                  setEditUser({ ...editUser, first_name: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label>Last Name: </label>
              <input
                type="text"
                value={editUser.last_name}
                onChange={(e) =>
                  setEditUser({ ...editUser, last_name: e.target.value })
                }
              />
            </div>
            <button type="submit" style={styles.button}>
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditUser(null)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  searchContainer: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "200px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  editForm: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  cancelButton: {
    marginLeft: "10px",
    padding: "10px 15px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default UserList;

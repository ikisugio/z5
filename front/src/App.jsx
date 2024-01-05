import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(user?.id, formData);
  };

  return (
    <div>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="avatar"
        value={formData.avatar}
        onChange={handleFormChange}
        placeholder="Avatar URL"
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

const UserDetails = ({ user, onEdit, onDelete }) => {
  return (
    <div>
      <p>Name is: {user.name}</p>
      <p>Avatar URL: {user.avatar}</p>
      <button onClick={() => onEdit(user)}>Update</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("https://65420d08f0b8287df1ff6761.mockapi.io/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const saveUser = (id, userData) => {
    const method = id ? "put" : "post";
    const url = `https://65420d08f0b8287df1ff6761.mockapi.io/users/${id || ""}`;

    axios[method](url, userData)
      .then((response) => {
        if (id) {
          setUsers(
            users.map((user) => (user.id === id ? response.data : user))
          );
        } else {
          setUsers([...users, response.data]);
        }
        setShowForm(false);
        setEditingUser(null);
      })
      .catch((error) => console.error(error));
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const startNewUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const deleteUser = (id) => {
    axios
      .delete(`https://65420d08f0b8287df1ff6761.mockapi.io/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        if (editingUser?.id === id) {
          setEditingUser(null);
          setShowForm(false);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="app">
      <div className="add-field">
        <button onClick={startNewUser}>Add User</button>
        {showForm && (
          <UserForm
            user={editingUser}
            onSave={saveUser}
            onCancel={cancelEdit}
          />
        )}
      </div>
      {users.map((user) => (
        <div key={user.id} className="user-item">
          <div className="name-field">
            <span className="user-id">{user.id}</span>
            <span className="user-name">{user.name}</span>
          </div>
          <div className="action-buttons">
            <button onClick={() => startEdit(user)}>Update</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            <button onClick={() => setEditingUser(user)}>View</button>
          </div>
        </div>
      ))}
      {editingUser && (
        <UserDetails
          user={editingUser}
          onEdit={startEdit}
          onDelete={deleteUser}
        />
      )}
    </div>
  );
};

export default App;

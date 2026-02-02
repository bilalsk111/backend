import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data.user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email } = e.target.elements;

    await axios.post(API, {
      name: name.value,
      phone: phone.value,
      email: email.value,
    });

    e.target.reset();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  const startEdit = (user) => {
    setEdit(user);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const { name, phone, email } = e.target.elements;

    await axios.patch(`${API}/${edit._id}`, {
      name: name.value,
      phone: phone.value,
      email: email.value,
    });

    setEdit(null);
    fetchUsers();
  };

  return (
    <main>
      {/* ADD USER */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="name" />
        <input name="phone" placeholder="phone" />
        <input name="email" placeholder="email" />
        <button>Add</button>
      </form>

      {/* EDIT USER */}
      {edit && (
        <form onSubmit={updateUser}>
          <input name="name" defaultValue={edit.name} />
          <input name="phone" defaultValue={edit.phone} />
          <input name="email" defaultValue={edit.email} />
          <button>Update</button>
          <button type="button" onClick={() => setEdit(null)}>
            Cancel
          </button>
        </form>
      )}

      {/* USER LIST */}
      <div className="cards">
        {users.map((user) => (
          <div className="card" key={user._id}>
            <h3>{user.name}</h3>
            <p>{user.phone}</p>
            <p>{user.email}</p>

            <button onClick={() => startEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;

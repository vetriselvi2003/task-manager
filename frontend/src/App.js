import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [dueDate, setDueDate] = useState("");

  const API_URL = "https://task-manager-2zo0.onrender.com/api/tasks";

  // 🔐 LOGIN
  const login = () => {
    fetch("https://task-manager-2zo0.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          alert(data.message || "Login failed");
        }
      });
  };

  // 🆕 REGISTER
  const register = () => {
    fetch("https://task-manager-2zo0.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "User registered!");
      });
  };

  // 🔓 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Fetch tasks
  const getTasks = () => {
    fetch(API_URL, {
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  // eslint-disable-next-line
  useEffect(() => {
  if (token) {
    fetch(API_URL, {
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  }
}, [token]);

  // Add task
  const addTask = () => {
    if (!title) return;

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title, dueDate })
    }).then(() => {
      setTitle("");
      setDueDate("");
      getTasks();
    });
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    }).then(() => getTasks());
  };

  // Toggle complete
  const toggleTask = (task) => {
    fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ completed: !task.completed })
    }).then(() => getTasks());
  };

  // Update task
  const updateTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title: editText })
    }).then(() => {
      setEditId(null);
      setEditText("");
      getTasks();
    });
  };

  // 🔐 LOGIN SCREEN
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-blue-200 to-purple-200">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-3 w-80">
          <h2 className="text-2xl font-bold text-center">Login 🔐</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
          />

          <button
            onClick={login}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

          <button
            onClick={register}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  // 🧠 MAIN APP
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          🚀 Task Manager
        </h1>

        <button
          onClick={logout}
          className="bg-gray-500 text-white px-3 py-1 rounded mb-4"
        >
          Logout
        </button>

        {/* Add Task */}
        <div className="flex gap-2 mb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Due Date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full mb-4 p-2 border rounded-lg"
        />

        {/* Tasks */}
        <div className="space-y-3">
          {tasks
            .filter(task =>
              task.title.toLowerCase().includes(search.toLowerCase())
            )
            .map(task => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
              >

                {editId === task._id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border p-1 rounded w-full mr-2"
                    />
                    <button
                      onClick={() => updateTask(task._id)}
                      className="bg-green-500 text-white px-3 rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p
                        onClick={() => toggleTask(task)}
                        className={`cursor-pointer ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="text-xs text-gray-400">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => {
                          setEditId(task._id);
                          setEditText(task.title);
                        }}
                        className="bg-yellow-400 px-2 rounded"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        🗑
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
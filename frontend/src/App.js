import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

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
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const API_URL = "https://task-manager-2zo0.onrender.com/api/tasks";

  // AUTH
  const login = () => {
    fetch("https://task-manager-2zo0.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          toast.success("Login successful 🎉");
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error("Login failed ❌");
        }
      });
  };

  const register = () => {
    fetch("https://task-manager-2zo0.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(() => toast.success("Registered 🎉"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast("Logged out 👋");
  };

  // FETCH
  const getTasks = () => {
    fetch(API_URL, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    if (token) getTasks();
  }, [token]);

  // CRUD
  const addTask = () => {
    if (!title) return toast.error("Empty task ❌");

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title, dueDate })
    }).then(() => {
      toast.success("Task added 🚀");
      setTitle("");
      setDueDate("");
      getTasks();
    });
  };

  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    }).then(() => {
      toast.success("Deleted 🗑");
      getTasks();
    });
  };

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

  const updateTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ title: editText })
    }).then(() => {
      toast.success("Updated ✏️");
      setEditId(null);
      setEditText("");
      getTasks();
    });
  };

  // 🔥 DRAG + SAVE ORDER
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setTasks(items);

    // 🔥 SAVE TO BACKEND
    fetch(`${API_URL}/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        tasks: items.map((task, index) => ({
          _id: task._id,
          order: index
        }))
      })
    });
  };

  // LOGIN UI
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-purple-200">
        <Toaster />
        <div className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col gap-3">
          <h2 className="text-center font-bold">
            {isLogin ? "Login 🔐" : "Register 🆕"}
          </h2>

          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="p-2 border rounded" />

          <button onClick={isLogin ? login : register} className="bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Login" : "Register"}
          </button>

          <p onClick={() => setIsLogin(!isLogin)} className="text-blue-500 cursor-pointer text-sm text-center">
            Toggle
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"} min-h-screen flex justify-center p-4`}>
      <Toaster />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-6 rounded-xl bg-white/30 backdrop-blur-xl shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold mb-4">🚀 Task Manager</h1>

        <div className="flex gap-2 mb-3">
          <button onClick={logout} className="bg-gray-500 text-white px-2 rounded">Logout</button>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-black text-white px-2 rounded">
            {darkMode ? "☀" : "🌙"}
          </button>
        </div>

        {/* DASHBOARD */}
        <div className="flex justify-between mb-3 text-sm">
          <span>Total: {tasks.length}</span>
          <span>Done: {tasks.filter(t => t.completed).length}</span>
          <span>Pending: {tasks.filter(t => !t.completed).length}</span>
        </div>

        {/* ADD */}
        <div className="flex gap-2 mb-3">
          <input value={title} onChange={e => setTitle(e.target.value)} className="flex-1 p-2 border rounded" />
          <button onClick={addTask} className="bg-indigo-500 text-white px-3 rounded">Add</button>
        </div>

        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full mb-2 p-2 border rounded" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full mb-3 p-2 border rounded" />

        {/* DRAG */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks
                  .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
                  .map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          whileHover={{ scale: 1.03 }}
                          className="bg-white p-3 rounded shadow mb-2 flex justify-between"
                        >
                          {editId === task._id ? (
                            <>
                              <input value={editText} onChange={e => setEditText(e.target.value)} className="border p-1" />
                              <button onClick={() => updateTask(task._id)} className="bg-green-500 text-white px-2 rounded">Save</button>
                            </>
                          ) : (
                            <>
                              <span onClick={() => toggleTask(task)} className="cursor-pointer">
                                {task.title}
                              </span>
                              <div>
                                <button onClick={() => {
                                  setEditId(task._id);
                                  setEditText(task.title);
                                }}>✏️</button>
                                <button onClick={() => deleteTask(task._id)}>🗑</button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </motion.div>
    </div>
  );
}

export default App;
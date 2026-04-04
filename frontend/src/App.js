import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [dueDate, setDueDate] = useState("");

  const API_URL = "https://task-manager-2zo0.onrender.com/api/tasks";

  // Fetch tasks
  const getTasks = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Add task
  const addTask = () => {
    if (!title) return;

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, dueDate }) // ✅ FIXED
    }).then(() => {
      setTitle("");
      setDueDate("");
      getTasks();
    });
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    }).then(() => getTasks());
  };

  // Toggle complete
  const toggleTask = (task) => {
    fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed: !task.completed })
    }).then(() => getTasks());
  };

  // Update task
  const updateTask = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: editText })
    }).then(() => {
      setEditId(null);
      setEditText("");
      getTasks();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🚀 Task Manager
        </h1>

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
          className="w-full mb-4 p-2 border rounded-lg"
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

                      {/* ✅ SHOW DUE DATE */}
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
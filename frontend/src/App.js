import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

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
      body: JSON.stringify({ title })
    }).then(() => {
      setTitle("");
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
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Task Manager 🚀</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.map(task => (
        <div key={task._id} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px"
        }}>
          
          {editId === task._id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={() => updateTask(task._id)}>Save</button>
            </>
          ) : (
            <>
              <p
                onClick={() => toggleTask(task)}
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                  margin: 0
                }}
              >
                {task.title}
              </p>

              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => {
                  setEditId(task._id);
                  setEditText(task.title);
                }}>
                  Edit
                </button>

                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
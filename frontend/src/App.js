import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks
  const getTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Add task
  const addTask = () => {
    if (!title) return;

    fetch("http://localhost:5000/api/tasks", {
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
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE"
    }).then(() => getTasks());
  };

  // Toggle complete
  const toggleTask = (task) => {
    fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed: !task.completed })
    }).then(() => getTasks());
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Task Manager 🚀</h1>

      {/* Input Section */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Task List */}
      {tasks.map(task => (
        <div
          key={task._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px"
          }}
        >
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

          <button
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer"
            }}
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
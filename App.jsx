import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Load from localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | completed

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add / Update task
  const handleAddOrUpdate = () => {
    if (!text.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, title: text } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: text,
          createdAt: new Date().toLocaleString(),
          completed: false,
        },
      ]);
    }

    setText("");
  };

  // Edit
  const handleEdit = (task) => {
    setText(task.title);
    setEditId(task.id);
  };

  // Delete
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle completion
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="app">
      <h1>📝 Todo App</h1>

      {/* Input */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty">No tasks here ✨</p>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? "completed" : ""}
            >
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />

                <div className="task-info">
                  <h3>{task.title}</h3>
                  <span>Created: {task.createdAt}</span>
                </div>
              </div>

              <div className="actions">
                <button
                  className="edit"
                  onClick={() => handleEdit(task)}
                  disabled={task.completed}
                >
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
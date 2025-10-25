import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/get-todo`);
      const data = await res.json();
      if (data.success) setTodos(data.todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/post-todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setName(""); // clear input
        fetchTodos(); // refresh list
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Todo App</h1>

      {/* Form */}
      <form onSubmit={addTodo} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={name}
          placeholder="Enter todo..."
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.5rem", width: "300px", marginRight: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul>
          {todos.map((todo, idx) => (
            <li key={idx}>{todo.name} - </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

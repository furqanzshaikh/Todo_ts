import React, { useEffect, useState } from 'react';
import './todos.css';
import axios, { AxiosResponse } from 'axios';

const Todos: React.FC = () => {
  interface Todo {
    _id: string;
    title: string;
    description: string;
  }

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [data, setData] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:3000/api/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to add a todo.');
      return;
    }
    if (!title.trim() || !description.trim()) return;

    try {
      let response: AxiosResponse<any, any>;
      if (editingTodo) {
        response = await axios.put(`http://localhost:3000/api/todos/update/${editingTodo._id}`, { title, description }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(data.map(todo => (todo._id === editingTodo._id ? response.data.data : todo)));
        setEditingTodo(null);
      } else {
        response = await axios.post('http://localhost:3000/api/todos/create', { title, description }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData([...data, response.data.data]);
      }
    } catch (error) {
      console.error('Error creating/updating todo:', error);
    }

    setTitle('');
    setDescription('');
  };

  const handleEdit = (todo: Todo) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to edit a todo.');
      return;
    }
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to delete a todo.');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/todos/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(data.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="todo-form-container">
      <form className="todo-form" onSubmit={handleSubmit}>
        <h2>{editingTodo ? 'Edit Todo' : 'Add Todo'}</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          ></textarea>
        </div>
        <button type="submit" className="todo-button">{editingTodo ? 'Update Task' : 'Add Task'}</button>
      </form>
      <div className="todo-list">
        <h2>Todo List</h2>
        {data.map((todo) => (
          <div key={todo._id} className="todo-item">
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <button onClick={() => handleEdit(todo)}>Edit</button>
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;

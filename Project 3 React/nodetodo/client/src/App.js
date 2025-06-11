// client/src/App.js
import React, { useState, useEffect } from 'react';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from './services/TodoService';

function App() {
  const [todos, setTodos]       = useState([]);
  const [text,  setText]        = useState('');
  const [filter, setFilter]     = useState('all');

  const load = () =>
    getTodos().then(r => setTodos(r.data));

 useEffect(() => {
  load();
}, []);


  const addTodo = e => {
    e.preventDefault();
    if (!text.trim()) return;
    createTodo(text).then(() => {
      setText('');
      load();
    });
  };

  const toggle = todo =>
    updateTodo(todo._id, !todo.done).then(load);

  const remove = id =>
    deleteTodo(id).then(load);

  const filtered = todos.filter(t =>
    filter === 'all' ? true : t.done === filter
  );

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 40 }}>
      <div className="jumbotron text-center">
        <h1>React ToDo <span className="badge">{todos.length}</span></h1>
      </div>

      <div className="btn-group" style={{ marginBottom: 20 }}>
        <button className="btn btn-default" onClick={() => setFilter('all')}>All</button>
        <button className="btn btn-success" onClick={() => setFilter(true)}>Done</button>
        <button className="btn btn-warning" onClick={() => setFilter(false)}>Not Done</button>
      </div>

      <ul className="list-group">
        {filtered.map(todo => (
          <li key={todo._id}
            className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo)}
              />{' '}
              <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
            </div>
            <button className="btn btn-danger btn-xs" onClick={() => remove(todo._id)}>×</button>
          </li>
        ))}
      </ul>

      <form onSubmit={addTodo} className="form-inline" style={{ marginTop: 20 }}>
        <div className="form-group" style={{ flexGrow: 1, marginRight: 10 }}>
          <input
            type="text"
            className="form-control"
            placeholder="New task"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
    </div>
  );
}

export default App;

// client/src/api.js
const BASE = 'http://localhost:4000/api/todos';

export async function getTodos() {
  const res = await fetch(BASE);
  return res.json();
}

export async function createTodo(text) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function updateTodo(id, done) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return res.json();
}

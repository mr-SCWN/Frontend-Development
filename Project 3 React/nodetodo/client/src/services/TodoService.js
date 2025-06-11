// client/src/services/TodoService.js
import axios from 'axios';
const API = '/api/todos';
export const getTodos    = ()           => axios.get(API);
export const createTodo  = text         => axios.post(API, { text });
export const updateTodo  = (id, done)   => axios.put(`${API}/${id}`, { done });
export const deleteTodo  = id           => axios.delete(`${API}/${id}`);

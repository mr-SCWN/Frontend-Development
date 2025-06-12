<script>
  import { onMount } from 'svelte';
  import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
  } from './api.js';

  let todos = [];
  let text = '';
  let filter = 'all'; // 'all' | true | false
  let loading = true;
  let error = null;

  async function load() {
    loading = true;
    try {
      todos = await getTodos();
    } catch (e) {
      error = e;
    } finally {
      loading = false;
    }
  }

  onMount(load);

  async function addTodo() {
    if (!text.trim()) return;
    await createTodo(text);
    text = '';
    await load();
  }

	async function toggle(id, done) {
		await updateTodo(id, done);
		await load();
	}

  async function remove(id) {
    await deleteTodo(id);
    await load();
  }

  $: filtered = todos.filter(t =>
    filter === 'all' ? true : t.done === filter
  );
</script>

<style>
  .btn-group button {
    margin-right: 0.5rem;
  }
  .done { text-decoration: line-through; color: #888; }
</style>

<main>
  <h1>ToDo ({todos.length})</h1>

  <!-- Filters -->
  <div class="btn-group">
    <button on:click={() => filter = 'all'} class:active={filter === 'all'}>All</button>
    <button on:click={() => filter = true} class:active={filter === true}>Done</button>
    <button on:click={() => filter = false} class:active={filter === false}>Not Done</button>
  </div>

  {#if loading}
    <p>Loading…</p>
  {:else if error}
    <p style="color:red">Error: {error.message}</p>
  {:else}
    <!-- List -->
    <ul>
 {#each filtered as todo (todo._id)}
   <li>
     <input
       type="checkbox"
       checked={todo.done}
       on:change={(e) => toggle(todo._id, e.target.checked)}
     />
     <span class:done={todo.done}>{todo.text}</span>
     <button on:click={() => remove(todo._id)}>×</button>
   </li>
 {/each}
    </ul>
  {/if}

  <!-- Addition form -->
  <form on:submit|preventDefault={addTodo}>
    <input
      type="text"
      placeholder="New task"
      bind:value={text}
    />
    <button type="submit">Add</button>
  </form>
</main>

// server.js
// =============================================================
//            Node + Express + MongoDB (Atlas) ToDo API
// =============================================================

const http            = require("http");
const express         = require("express");
const mongoose        = require("mongoose");
const cors            = require("cors");
const methodOverride  = require("method-override");
const bodyParser      = require("body-parser");

const app  = express();
const port = process.env.PORT || 4000;

// -----------------
// Connect to MongoDB Atlas
// -----------------
mongoose.connect(
  "mongodb+srv://IvanKaliadzich:8fZy3kgDGtOOMwvL@" +
    "myclaster0.rrzudwu.mongodb.net/tododb?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB connected successfully!"))
.catch(err => console.error("MongoDB connection error:", err));

// -----------------
// Middleware
// -----------------
app.use(cors());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------
// Mongoose model
// -----------------
const Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean
});

// -----------------
// API Routes
// -----------------

// GET all todos
app.get("/api/todos", (req, res) => {
  Todo.find((err, todos) => {
    if (err) return res.status(500).send(err);
    res.json(todos);
  });
});

// GET single todo by ID
app.get("/api/todos/:todo_id", (req, res) => {
  Todo.findById(req.params.todo_id, (err, todo) => {
    if (err) return res.status(500).send(err);
    if (!todo) return res.status(404).send("Not found");
    res.json(todo);
  });
});

// CREATE new todo
app.post("/api/todos", (req, res) => {
  console.log(">>> POST /api/todos, body:", req.body);
  Todo.create(
    { text: req.body.text, done: false },
    (err, created) => {
      if (err) return res.status(500).send(err);
      // return updated data
      Todo.find((err, todos) => {
        if (err) return res.status(500).send(err);
        res.json(todos);
      });
    }
  );
});

// UPDATE a todo's "done" status
app.put("/api/todos/:todo_id", (req, res) => {
  console.log(
    `>>> PUT /api/todos/${req.params.todo_id}, done: ${req.body.done}`
  );
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    { done: req.body.done },
    { new: true },
    (err /*, updatedTodo*/) => {
      if (err) return res.status(500).send(err);
      // вернуть обновлённый список
      Todo.find((err, todos) => {
        if (err) return res.status(500).send(err);
        res.json(todos);
      });
    }
  );
});

// DELETE a todo
app.delete("/api/todos/:todo_id", (req, res) => {
  Todo.deleteOne({ _id: req.params.todo_id }, err => {
    if (err) return res.status(500).send(err);
    // вернуть обновлённый список
    Todo.find((err, todos) => {
      if (err) return res.status(500).send(err);
      res.json(todos);
    });
  });
});

// -----------------
// Start server
// -----------------
http
  .createServer(app)
  .listen(port, () => console.log(`Express server listening on http://localhost:${port}`));

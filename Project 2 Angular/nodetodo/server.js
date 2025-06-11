// server.js
var http          = require("http");
var express       = require("express");
var app           = express();
var mongoose      = require("mongoose");
var cors          = require("cors");
var methodOverride = require("method-override");
var bodyParser    = require("body-parser");
var path          = require("path");

var port = process.env.PORT || 4000;

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://IvanKaliadzich:8fZy3kgDGtOOMwvL@myclaster0.rrzudwu.mongodb.net/tododb?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB connected successfully!"))
.catch(err => console.error("MongoDB connection error:", err));

// Middlewares
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Define Todo model
var Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean
});

// ================== API ROUTES ================== //

// GET all todos
app.get("/api/todos", function(req, res) {
  Todo.find(function(err, todos) {
    if (err) return res.status(500).send(err);
    res.json(todos);
  });
});

// GET a single todo by ID
app.get("/api/todos/:todo_id", function(req, res) {
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err) return res.status(500).send(err);
    res.json(todo);
  });
});

// CREATE a new todo
app.post("/api/todos", function(req, res) {
  Todo.create(
    { text: req.body.text, done: false },
    function(err) {
      if (err) return res.status(500).send(err);
      // Return updated list
      Todo.find(function(err, todos) {
        if (err) return res.status(500).send(err);
        res.json(todos);
      });
    }
  );
});

// UPDATE the 'done' status of a todo
app.put("/api/todos/:todo_id", function(req, res) {
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    { done: req.body.done },
    { new: true },
    function(err) {
      if (err) return res.status(500).send(err);
      // Return updated list
      Todo.find(function(err, todos) {
        if (err) return res.status(500).send(err);
        res.json(todos);
      });
    }
  );
});

// DELETE a todo
app.delete("/api/todos/:todo_id", function(req, res) {
  Todo.deleteOne({ _id: req.params.todo_id }, function(err) {
    if (err) return res.status(500).send(err);
    // Return updated list
    Todo.find(function(err, todos) {
      if (err) return res.status(500).send(err);
      res.json(todos);
    });
  });
});

// Catch-all route to serve index.html
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
http.createServer(app).listen(port, function() {
  console.log("Express server listening on http://localhost:" + port);
});

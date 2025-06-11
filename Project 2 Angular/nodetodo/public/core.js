// public/core.js
angular
  .module("nodeTodo", [])
  .controller("mainController", ["$scope", "$http", function($scope, $http) {
    // Initialize filterStatus from localStorage (persist between reloads)
    var saved = localStorage.getItem("filterStatus");
    if (saved === "true")       $scope.filterStatus = true;
    else if (saved === "false") $scope.filterStatus = false;
    else                        $scope.filterStatus = "all";

    $scope.formData = { text: "" };
    $scope.todos    = [];

    // Change filter and save choice
    $scope.setFilter = function(status) {
      $scope.filterStatus = status;
      localStorage.setItem("filterStatus", status.toString());
    };

    // Filter function for ng-repeat
    $scope.filterFn = function(todo) {
      if ($scope.filterStatus === "all") return true;
      return todo.done === $scope.filterStatus;
    };

    // Load list of todos from server
    $scope.loadTodos = function() {
      $http.get("/api/todos")
        .then(function(response) {
          $scope.todos = response.data;
        }, function(error) {
          console.error("GET /api/todos failed:", error);
        });
    };
    $scope.loadTodos();

    // Create a new todo
    $scope.createTodo = function() {
      if (!$scope.formData.text.trim()) return;
      $http.post("/api/todos", { text: $scope.formData.text })
        .then(function() {
          $scope.formData.text = "";
          $scope.loadTodos();
        }, function(error) {
          console.error("POST /api/todos failed:", error);
        });
    };

    // Update the 'done' status of a todo
    $scope.updateTodo = function(todo) {
      $http.put("/api/todos/" + todo._id, { done: todo.done })
        .then(function(response) {
          $scope.todos = response.data;
        }, function(error) {
          console.error("PUT /api/todos/" + todo._id + " failed:", error);
        });
    };

    // Delete a todo
    $scope.deleteTodo = function(id) {
      $http.delete("/api/todos/" + id)
        .then(function(response) {
          $scope.todos = response.data;
        }, function(error) {
          console.error("DELETE /api/todos/" + id + " failed:", error);
        });
    };
  }]);

var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/todo_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSanitizer());

var todoSchema = new mongoose.Schema({
  text: String,
});

var Todo = mongoose.model("Todo", todoSchema);

// Enable CORS - Cross-Origin Resource Sharing - so we can access it from the client
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


app.get("/", function (req, res) {
  res.redirect("/todos");
});

// function to be used in the .get("/todos", ..) route
// this allows us to escape any special characters with a backslash
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.get("/todos", function (req, res) {
  if (req.query.keyword) { // if there's a query string called keyword then..
    // set the constant (variable) regex equal to a new regular expression created from the keyword 
    // that we pulled from the query string
    var regex = new RegExp(escapeRegex(req.query.keyword), 'gi');
    // query the database for Todos with text property that match the regular expression version of the search keyword
    Todo.find({
      text: regex
    }, function (err, todos) {
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  } else {
    // if there wasn't any query string keyword then..
    Todo.find({}, function (err, todos) { // query the db for all todos
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  }
});

app.post("/todos", function (req, res) {
  if (req.body.todo.text) {
    req.body.todo.text = req.sanitize(req.body.todo.text); // prevent script injection
    var formData = req.body.todo;
    Todo.create(formData, function (err, newTodo) {
      if (err) {
        res.render("new");
      } else {
        res.json(newTodo);
      }
    });
  } else {
    res.json({
      error: "Invalid input!"
    });
  }
});

app.put("/todos/:id", function (req, res) {
  Todo.findByIdAndUpdate(req.params.id, req.body.todo, {
    new: true
  }, function (err, todo) { // new:true reutrns updated item, not original
    if (err) {
      console.log(err);
    } else {
      res.json(todo);
    }
  });
});

app.delete("/todos/:id", function (req, res) {
  Todo.findByIdAndRemove(req.params.id, function (err, todo) {
    if (err) {
      console.log(err);
    } else {
      res.json(todo);
    }
  });
});

app.listen(3000, function () {
  console.log('Server running on port 3000');
});
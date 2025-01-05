const express = require("express");
const app = express();
const path = require("path");
const { v4: uuid } = require("uuid");
const { runInNewContext } = require("vm");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let tasks = [

];

app.get("/", (req, res) => {
  res.render("homepage.ejs", { tasks });
});

app.get("/add-task", (req, res) => {
  res.render("add-task.ejs");
});

app.get("/edit-task/:id", (req, res) => {
  const { id } = req.params;
  const details = tasks.find((work) => work.id === id);
  res.render("edit-task.ejs", { details });
});

app.post("/add-task", (req, res) => {
  const { name, priority, deadline } = req.body;
  const newTask = {
    id: uuid(),
    name,
    priority,
    deadline,
  };
  tasks.push(newTask);
  res.redirect("/");
});

app.patch("/edit-task/:id", (req, res) => {
  const { id } = req.params;
  const { name, priority, deadline } = req.body;
  const foundDetails = tasks.find((work) => work.id === id);
  if (foundDetails) {
    foundDetails.name = name;
    foundDetails.priority = priority;
    foundDetails.deadline = deadline;
  } else {
    res.status(404).send("Task not found");
  }
  res.redirect("/");
});

app.delete("/delete-task/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(work=>work.id !== id);

  res.redirect("/");
});

// app.delete("/delete-task/:id", (req, res) => {
//   const { id } = req.params;
//   tasks = tasks.filter(task => task.id !== id); // Remove the task from the array
//   res.redirect("/"); // Redirect to the homepage after deleting
// });

app.listen(3000, () => {
  console.log("Listining to part 3000");
});

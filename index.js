//js input validator package
const Joi = require("joi");

const express = require("express");
const app = express();

//middleware returned by express.json()
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello");
});

//get all courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/add/course", (req, res) => {
  const { error } = validateCourse(req.body); //result.error 's equivalent

  if (error) {
    //400(bad request)
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//update
app.put("/api/courses/:id", (req, res) => {
  //search for course
  //if not exist,return then 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course of given ID not found");
    return;
  }
  //validate
  //if invalid,400-bad request

  //const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); //result.error 's equivalent

  if (error) {
    //400(bad request)
    res.status(400).send(error.details[0].message);
    return;
  }

  //update course
  //return updated course
  course.name = req.body.name;
  res.send(course);
});

//get single course
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course of given ID not found");
    return;
  }
  res.send(course);
});

//delete API
app.delete("/api/courses/:id", (req, res) => {
  //search course
  //if not found, 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course of given ID not found");
    return;
  }
  //delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //return deleted course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => `Listening on port ${port}...`);

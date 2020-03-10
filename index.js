const express = require("express");
const app = express();
const {
  parseIntId,
  verifyProjectExist,
  verifyTaskExist
} = require("./middlewares");

let id = 0;
let projects = [];

function passProjectsForAllRoutes(req, res, next) {
  req.projects = projects;
  next();
}

function logAmountRequests(req, res, next) {
  console.count("Request count");
  next();
}

function logTimeRequest(req, res, next) {
  console.time("Request time");
  next();
  console.timeEnd("Request time");
}

app
  .use(express.json())
  .use(passProjectsForAllRoutes)
  .use(logAmountRequests)
  .use(logTimeRequest);

app.get("/projects", (req, res) => {
  res.json(req.projects);
});

app.get("/projects/:id", parseIntId, verifyProjectExist, (req, res) => {
  const { id } = req.params;
  const project = req.projects.find(p => p.id === id);

  res.json(project);
});

app.post("/projects", (req, res) => {
  const { title } = req.body;
  const project = { id: ++id, title, tasks: [] };
  projects.push(project);

  res.json(project);
});

app.put("/projects/:id", parseIntId, verifyProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects = req.projects.map(p => {
    if (p.id === id) {
      p.title = title;
    }

    return p;
  });
  const project = projects.find(p => p.id === id);

  res.json(project);
});

app.delete("/projects/:id", parseIntId, verifyProjectExist, (req, res) => {
  const { id } = req.params;
  projects = req.projects.filter(p => p.id !== id);

  res.send();
});

app.get("/projects/:id/tasks", parseIntId, verifyProjectExist, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.projects.find(p => p.id === id);

  res.json(tasks);
});

app.post(
  "/projects/:id/tasks",
  parseIntId,
  verifyProjectExist,
  verifyTaskExist(),
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    projects = req.projects.map(p => {
      if (p.id === id) {
        p.tasks.push(title);
      }

      return p;
    });
    const { tasks } = projects.find(p => p.id === id);

    res.send(tasks);
  }
);

app.delete(
  "/projects/:id/tasks",
  parseIntId,
  verifyProjectExist,
  verifyTaskExist(false),
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    projects = req.projects.map(p => {
      if (p.id === id) {
        p.tasks = p.tasks.filter(
          t =>
            JSON.stringify(t).toLowerCase() !==
            JSON.stringify(title).toLowerCase()
        );
      }

      return p;
    });
    const { tasks } = projects.find(p => p.id === id);

    res.send(tasks);
  }
);

app.listen(3000);

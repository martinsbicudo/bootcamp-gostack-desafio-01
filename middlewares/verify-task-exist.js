module.exports = (verification = true) => (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  let taskExist = false;

  req.projects.map(p => {
    if (
      p.id === id &&
      p.tasks.some(
        t =>
          JSON.stringify(t).toLowerCase() ===
          JSON.stringify(title).toLowerCase()
      ) === verification
    ) {
      taskExist = true;
    }
  });

  return (taskExist
    ? () =>
        res.status(409).json({
          error: `Task ${verification ? "already" : "doesn't"} exists`
        })
    : next)();
};

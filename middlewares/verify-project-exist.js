module.exports = (req, res, next) => {
  const { id } = req.params;

  if (id && !req.projects.some(p => p.id === parseInt(id))) {
    return res.status(404).json({ error: "Project not found" });
  }

  next();
};

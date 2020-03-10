module.exports = (req, res, next) => {
  const { id } = req.params;

  if (id) {
    req.params.id = parseInt(id);
  }

  next();
};

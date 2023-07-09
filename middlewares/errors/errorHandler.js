module.exports = (err, req, res, next) => {
  const error = {};

  console.log(err);
  for (const [key, value] in err) {
    console.log(`${key}: ${value}`);
  }

  if (err.code === 11000) {
  }
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};
``;

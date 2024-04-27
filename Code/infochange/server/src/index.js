const express = require("express");
const app = express();

const port = 1024;

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server started on ${port} port`);
});

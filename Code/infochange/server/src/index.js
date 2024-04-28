const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const port = 1024;

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/auth", cors(), (req, res) => {
  res.json({ status: "1" });
});

app.listen(port, () => {
  console.log(`Server started on ${port} port`);
});

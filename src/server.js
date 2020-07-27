import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.render("../public/index.html");
});

app.listen(3333, () =>
  console.log("Server running on http://localhost:3333 ...")
);

import express, { json } from "express";
import Tasks from "./db_content/tasks.js";
import MongoConnect from "./database.js";
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get("/add-task", (req, res) => {
  res.send("<h2>Entered..!!!!</h2>");
});

app.post("/add-task", async (req, res, next) => {
  const data = req.body;
  const task = new Tasks(data);

  await task.save();
});

app.get("/get-tasks", async (req, res) => {
  const data = await Tasks.get();
  res.send(JSON.stringify(data));
});

MongoConnect(() => {
  app.listen(3002);
});

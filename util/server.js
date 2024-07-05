import express from "express";
const app = express();
const port = 3000;
import mongoConnect from "./database.js";

mongoConnect((client) => {
  console.log(client);
  app.listen(port);
});

import { getDB } from "../database.js";

export default class Tasks {
  constructor(data) {
    this.name = data[0].name;
    this.priority = data[0].priority;
    this.desc = data[0].desc;
  }
  async save() {
    const db = getDB();
    const result = await db.collection("Tasks").insertOne(this);
    return result;
  }

  static async get() {
    const db = getDB();
    const result = await db
      .collection("Tasks")
      .find()
      .sort({ _id: -1 })
      .toArray()
      .then((tasks) => {
        return tasks;
      })
      .catch((err) => {
        throw err;
      });
    return result;
  }
}

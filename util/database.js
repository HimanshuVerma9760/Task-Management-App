import mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;

const password = encodeURIComponent("Hh@35412879");
let _db;
export default function MongoConnect(callback) {
  mongoClient
    .connect(
      `mongodb+srv://himanshu2512verma:${password}@shopcluster.9beohtt.mongodb.net/?retryWrites=true&w=majority&appName=ShopCluster`
    )
    .then((client) => {
      _db = client.db("TaskManager");
      callback();
    });
}

export const getDB = () => {
  if (_db) {
    return _db;
  } else {
    console.log("db not found");
  }
};

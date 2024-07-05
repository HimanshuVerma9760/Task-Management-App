import mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;

const encodedPassword = encodeURIComponent("Hh@35412879");

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      `mongodb+srv://himanshu2512verma:${encodedPassword}@shopcluster.9beohtt.mongodb.net/?retryWrites=true&w=majority&appName=ShopCluster`
    )
    .then((client) => {
      console.log("Connected...!!");
      callback(client);
    })
    .catch((err) => {
      console.log("error: " + err);
    });
};
export default mongoConnect;

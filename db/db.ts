let mongoos = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

const connectDb = async () => {
  try {
    const uri = "mongodb://localhost:27017/crud";
    mongoos.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB Connected")
  } catch (err:any) {
    console.log(err.message);
    process.exit(1);
  }
};


module.exports = connectDb;
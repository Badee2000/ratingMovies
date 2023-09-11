const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
console.log("You are in: ", process.env.NODE_ENV);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    // logging: process.env.NODE_ENV === "development", // Enable logging only in development environment
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("yes re-sync done!");
//   })
//   .catch((err) => {
//     console.log("ERROR SYNC: ", err);
//   });

module.exports = db;

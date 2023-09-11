const db = require("./db");
const dotenv = require("dotenv");
const app = require("./app");
const sequelize = db.sequelize;

//HANDLE ANY UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Closing server...");
  console.log(err.name, err.message);
  //We can shutdown without closing the server because UNCAUGHT EXCEPTIONS
  //Are not going to happen asynchronously
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR SYNC: ", err);
  });

process.on("unhandledRejection", (err) => {
  //The application is not going to work at all so it is better to shut down our application.
  console.log("UNHANDELR REJECTION! Closing server...");
  console.log(err.name, err.message);
  //It is better to close the server before shutting down to give the server the time to finish all the requests.
  server.close(() => {
    console.log("SHUTTING DOWN...");
    //Code 0 stands for success, And the code 1 stands for uncaught exception.
    process.exit(1);
  });
});

/**

- `unhandledRejection` handles unhandled Promise rejections.
- `uncaughtException` handles unhandled synchronous errors.

 */

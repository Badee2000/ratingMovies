const express = require("express");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//Set Security HTTP headers
app.use(helmet());

const userRouter = require("./routes/userRouter");
const ratingRouter = require("./routes/ratingRouter");
const movieRouter = require("./routes/movieRouter");
const rateLimit = require("express-rate-limit");

//Middlewares:
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  max: 100,
  //One hour
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

const loginLimiter = rateLimit({
  //One hundred requests
  max: 3,
  //One hour
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use("/api/v1/users/login", loginLimiter);

app.use("/users", limiter);
app.use("/users/login", loginLimiter);

//Body parser, reading data from body into body.req
app.use(express.json({ limit: "10kb" }));

//Data sanitization against XSS
//EXAMPLE: name while creating a user : <div id='bad-code'>Name</div>
app.use(xss());

//Prevent parameter pollution (clear up the query string)
//Example: {{URL}}api/v1/tours?sort=duration&sort=price. NOT ACCEPTED
//Example: {{URL}}api/v1/tours?duration=5&duration=9. ACCEPTED
//We can specify a white list for the parameters that we use the same pollution, which allow duplicate in the query string
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use("/users", userRouter);
app.use("/ratings", ratingRouter);
app.use("/movies", movieRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

//Not Done Yet:
// 1) Security

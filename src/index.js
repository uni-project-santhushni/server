import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import UserRoute from "./routes/UserRoute.js";
import CattleRoute from "./routes/CattleRoute.js";
import VaccineRoute from "./routes/VaccineRoute.js";
import { TriggerEveryMidnight } from "./utility/CronJob.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      // httpOnly: false,
      // secure: false
    },
  })
);

app.use("/user", UserRoute);
app.use("/cattle", CattleRoute);
app.use("/vaccine", VaccineRoute);


// cron job
cron.schedule("* * * * * *", () => {
  // TriggerEveryMidnight();
  // console.log("Triggered");
});


// cron.schedule("0 0 * * *", () => {
//   TriggerEveryMidnight();
// });


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

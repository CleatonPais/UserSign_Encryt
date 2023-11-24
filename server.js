console.log("Welcome to user regsitration app");

import express from "express";
import router from "./routes/routes.js";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { uri } from "./models/userModel.js";
const PORT = process.env.PORT || 3000;

const app = express();

// console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT} !!!!`);
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const session_store = new MongoStore({
  mongoUrl: uri,
  dbName: "conestoga_users",
  collectionName: "Conestoga_User_sessions",
});

app.use(
  session({
    secret: "A Secret Key to sign cookies",
    resave: false,
    saveUninitialized: false,
    session_store,
  })
);

// code for testinf session varibale not working need to check
// app.get("/test", (res, req) => {
//   req.session.usr_name = "Cleaton";
//   req.session.usr_email = "Cleaton@gmail.com";
//   console.log(req.session);

//   delete req.session.usr_name;
//   delete req.session.usr_email;

//   res.send("Uers Test Page");
// });

app.use("/", router);

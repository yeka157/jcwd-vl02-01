// require("dotenv/config");
const { join } = require("path");
require('dotenv').config({ path: join(__dirname, '../.env') });
const express = require("express");
const cors = require("cors");
const bearerToken = require('express-bearer-token');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
// app.use(
//   cors({
//     origin: [
//       process.env.WHITELISTED_DOMAIN &&
//         process.env.WHITELISTED_DOMAIN.split(","),
//     ],
//   })
// );


app.use(cors());
app.use(express.json());
app.use(bearerToken());

// #destination file storage(image/pdf/document)
app.use("/", express.static(__dirname + "/public"));

// DB Check Connection


//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});


const configRouter = require('./routers');
app.use('/api', configRouter);

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

// DB Connection
const { dbConf } = require('./config/db');
dbConf.getConnection((err, connection) => {
  if (err) {
    console.log('Error mysql connection', err.sqlMessage);
  }

  console.log('Connected to MySql:', connection.threadId);
})

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

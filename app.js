const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const taro = require("./routes/taro");
const disease = require("./routes/disease");

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1", auth);
app.use("/api/v1", taro);
app.use("/api/v1", disease);

module.exports = app;
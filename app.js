const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth");
const product = require("./routes/product");
const service = require("./routes/service");
const order = require("./routes/order");

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1", auth);
app.use("/api/v1", product);
app.use("/api/v1", service);
app.use("/api/v1", order);

module.exports = app;
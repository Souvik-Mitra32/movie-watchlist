const path = require("path");
const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./src/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/public")));
app.use(session({
    secret: "yourSecret",
    resave: false,
    saveUninitialized: true,
}));

const viewRoutes = require(path.join(__dirname, "./src/routes/view.route.js"));

app.use("/", viewRoutes);

module.exports = app;
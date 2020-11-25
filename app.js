const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
mongoose.connect("mongodb://localhost:27017/unimelb-course-planar", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("main");
});

app.get("/cold-morning", (req, res) => {
    res.render("cold-morning");
});

app.get("/waterfall", (req, res) => {
    res.render("waterfall");
});

app.get("/city-night-walk", (req, res) => {
    res.render("city-night-walk");
});

app.get("/springtime", (req, res) => {
    res.render("springtime");
});

app.get("/wander", (req, res) => {
    res.render("wander");
});

app.get("/sleep-deprived", (req, res) => {
    res.render("sleep-deprived");
});

app.get("/", (req, res) => {
    res.render("");
});

app.listen(3000, () => {
    console.log("Run Server:");
});

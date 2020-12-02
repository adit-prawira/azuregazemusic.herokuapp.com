//Require all required libraries
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

//Require error handling class
const ExpressError = require("./utils/ExpressError");

//Require all routes
const albumsRoutes = require("./routes/albums");
const reviewRoutes = require("./routes/reviews");

//Require flash and session
const flash = require("connect-flash");
const session = require("express-session");
const { use } = require("passport");

app.engine("ejs", ejsMate);
mongoose.connect("mongodb://localhost:27017/AzureGazeMusic", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Mongo database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Create cookies and session will expire in a week (converted in milliseconds)
const sessionConfig = {
    secret: "thisshouldbeasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        //Adding extra security
        htttpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};
app.use(flash());
app.use(session(sessionConfig));

//Creating Flash middleware
app.use((req, res, next) => {
    console.log(req.session);

    //Add for users later
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("main");
});

app.get("/register", async (req, res, next) => {
    res.render("register");
});

app.get("/login", async (req, res, next) => {
    res.render("login");
});

app.use("/", albumsRoutes);
app.use("/:name/reviews", reviewRoutes);

app.all("*", (req, rex, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong ! :(";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("Run Server:");
});

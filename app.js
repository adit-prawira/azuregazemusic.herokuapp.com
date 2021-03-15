if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
//Require all required libraries
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const helmet = require("helmet");

//Require flash and session
const flash = require("connect-flash");
const session = require("express-session");

//Mongo and Mongoose libraries
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");

const MongoDBStore = require("connect-mongo")(session);

//Require error handling class
const ExpressError = require("./utils/ExpressError");

//Require all routes
const albumsRoutes = require("./routes/albums");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

//Require authentication libraries
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//|| "mongodb://localhost:27017/AzureGazeMusic"
const dataBaseUrl = process.env.DB_URL;
app.engine("ejs", ejsMate);
mongoose.connect(dataBaseUrl, {
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    mongoSanitize({
        replaceWith: "_",
    })
);
const secret = process.env.SECRET || "thisshouldbeasecret";
//Create cookies and session will expire in a week (converted in milliseconds)
const store = new MongoDBStore({
    url: dataBaseUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("Session store error", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //Adding extra security
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};
app.use(flash());
app.use(session(sessionConfig));

//Helmet securities
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    // "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = ["https://fonts.gstatic.com"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: ["'self'", "blob:", "data:"],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc: ["'self'", "blob:", "data:"],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("main");
});

app.use("/", userRoutes);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Run Server:");
});

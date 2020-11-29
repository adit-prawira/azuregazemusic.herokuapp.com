const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const Album = require("./models/album");
const Review = require("./models/review");
const { AlbumSchema, ReviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");

app.engine("ejs", ejsMate);
mongoose.connect("mongodb://localhost:27017/AzureGazeMusic", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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

//Review middleware
const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map((item) => item.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.render("main");
});

app.get(
    "/:name",
    catchAsync(async (req, res) => {
        const { name } = req.params;
        console.log(req.params);
        const album = await Album.find({ name }).populate("reviews");
        const albumDat = album[0];
        console.log(albumDat);
        // const allAlbums = (await Album.find()).map((item) => item.name);
        const albumName = album[0].name;
        if (!album) {
            res.redirect("/");
        }
        // albumDat.reviews = [];
        // await albumDat.save();
        res.render(albumName, { albumDat });
    })
);

app.post(
    "/:name/reviews",
    catchAsync(async (req, res) => {
        const { name } = req.params;
        const album = (await Album.find({ name }))[0];
        const review = new Review(req.body.review);

        album.reviews.push(review);
        await review.save();
        await album.save();

        res.redirect(`/${album.name}`);
    })
);

app.delete(
    "/:name/reviews/:reviewId",
    catchAsync(async (req, res) => {
        const { name, reviewId } = req.params;
        console.log(req.params);
        console.log(
            await Album.findOneAndUpdate(
                { name },
                {
                    $pull: { reviews: reviewId },
                }
            )
        );

        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/${name}`);
    })
);

app.all("*", (req, rex, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong" } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong ! :(";
    res.render("error", { err });
});

app.listen(3000, () => {
    console.log("Run Server:");
});

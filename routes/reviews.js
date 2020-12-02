const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const Album = require("../models/album");

const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map((item) => item.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    catchAsync(async (req, res) => {
        const { name } = req.params;
        const album = (await Album.find({ name }))[0];
        const review = new Review(req.body.review);

        album.reviews.push(review);
        await review.save();
        await album.save();

        req.flash("success", "Successfully created a review");
        res.redirect(`/${album.name}`);
    })
);

router.delete(
    "/:reviewId",
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
        req.flash("success", "Successfully deleted your review");
        res.redirect(`/${name}`);
    })
);

module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");

const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map((item) => item.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

router.post("/", catchAsync(reviews.postReview));

router.delete("/:reviewId", catchAsync(reviews.deleteReview));

module.exports = router;

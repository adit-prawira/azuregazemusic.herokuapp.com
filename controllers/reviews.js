const Review = require("../models/review");
const Album = require("../models/album");

module.exports.postReview = async (req, res) => {
    const { name } = req.params;
    const album = (await Album.find({ name }))[0];
    const review = new Review(req.body.review);

    album.reviews.push(review);
    await review.save();
    await album.save();

    req.flash("success", "Successfully created a review");
    res.redirect(`/${album.name}`);
};

module.exports.deleteReview = async (req, res) => {
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
};

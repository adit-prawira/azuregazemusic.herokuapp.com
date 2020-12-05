const Album = require("../models/album");

module.exports.showAlbum = async (req, res) => {
    const { name } = req.params;
    console.log(req.params);
    const album = await Album.find({ name })
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    const albumDat = album[0];
    const albumName = album[0].name;
    if (!album) {
        res.redirect("/");
    }
    // albumDat.reviews = [];
    // await albumDat.save();
    res.render(`albums/${albumName}`, { albumDat });
};

const Album = require("../models/album");

module.exports.showAlbum = async (req, res) => {
    const { name } = req.params;
    const album = await Album.find({ name })
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    const albumDat = album[0];
    // const albumName = album[0].name;
    if (!album) {
        res.redirect("/");
    }
    // albumDat.reviews = [];
    // await albumDat.save();
    const albumTitle = albumDat.name
        .replace(/-/g, " ")
        .split(" ")
        .map((st) => st.replace(st.charAt(0), st.charAt(0).toUpperCase()))
        .join(" ");
    res.render("albums/show", { albumDat, albumTitle });
};

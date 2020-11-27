const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: String,
    album_type: String,
    tracks: [
        {
            title: String,
            track_number: Number,
        },
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

module.exports = mongoose.model("Album", AlbumSchema);

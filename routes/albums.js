const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const albums = require("../controllers/albums");
router.get("/:name", catchAsync(albums.showAlbum));

module.exports = router;

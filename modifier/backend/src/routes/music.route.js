const express = require("express");
const { getSongsByMood } = require("../controllers/youtube.controller");

const router = express.Router();

router.get("/song", getSongsByMood);

module.exports = router;
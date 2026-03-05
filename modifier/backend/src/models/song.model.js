const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        enum: ["happy", "sad", "surprise", "angry", "neutral"],
        required: true
    }
});

const songModel = mongoose.model('songs', songSchema);
module.exports = songModel;
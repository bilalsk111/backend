const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")


async function uploadSong(req, res) {
    try {
        const songBuffer = req.file.buffer
        const { mood } = req.body

        // Read only required ID3 tags
        const tags = id3.read(songBuffer)
        const title = tags.title || "Unknown Title"
        const artist = tags.artist || "Unknown Artist"
        const year = tags.year || new Date().getFullYear()

        // Upload song & poster in parallel
        const [songFile, posterFile] = await Promise.all([
            storageService.uploadFile({
                buffer: songBuffer,
                filename: `${title}.mp3`,
                folder: "/cohort-2/moodify/songs"
            }),
            storageService.uploadFile({
                buffer: tags.image?.imageBuffer,
                filename: `${title}.jpeg`,
                folder: "/cohort-2/moodify/posters"
            })
        ])

        // Create song in DB
        const song = await songModel.create({
            title,
            year,
            artist,
            url: songFile.url,
            posterUrl: posterFile?.url,
            mood
        })

        res.status(201).json({
            message: "Song created successfully",
            song
        })
    } catch (error) {
        console.error("Upload song error:", error)
        res.status(500).json({ message: "Failed to upload song", error: error.message })
    }
}
async function getSong(req, res) {

    const { mood } = req.query

    const song = await songModel.findOne({
        mood,
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })

}


module.exports = { uploadSong, getSong }
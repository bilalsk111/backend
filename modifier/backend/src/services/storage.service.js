const ImageKit = require("@imagekit/nodejs").default;

const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Upload buffer to ImageKit
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} folder
 * @returns {Promise<{url: string}>}
 */
async function uploadFile({ buffer, filename, folder = "" }) {
    if (!buffer) throw new Error("No file buffer provided");

    try {
        const file = await client.files.upload({
            file: buffer,         // pass buffer directly
            fileName: filename,
            folder
        });
        return file; // contains file.url
    } catch (err) {
        console.error("ImageKit upload error:", err.message);
        throw err;
    }
}

module.exports = { uploadFile };
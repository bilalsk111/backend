const axios = require("axios");

async function getSongsByMood(req, res) {
  try {
    const mood = (req.query.mood || "neutral").toLowerCase();

    // Humne yahan "official music video" aur negative filters (-lofi -jukebox) add kiye hain
    const moodMap = {
      happy: "latest Bollywood official music video 2026 -lofi -jukebox -hour",
      sad: "Arijit Singh sad official song -lofi -jukebox -slowed -reverb",
      surprise: "latest Hindi party official video -lofi -mix",
      neutral: "Lofi nahi, official chill Bollywood songs -remix -jukebox",
      calm: "soothing Bollywood official acoustic -meditation -lofi -jukebox",
      angry: "aggressive bollywood rock official video -lofi"
    };

    const query = moodMap[mood] || "latest bollywood official song";

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          maxResults: 20, // Zyada results fetch karke filter karenge
          type: "video",
          videoCategoryId: "10", // Category 10 is strictly Music
          videoDuration: "medium", // Filters out shorts and very long jukeboxes (3-20 mins)
          relevanceLanguage: "hi",
          key: process.env.YOUTUBE_API_KEY
        }
      }
    );

    // Map songs and clean titles (YouTube titles are often messy)
    const songs = response.data.items.map((item) => {
      let cleanTitle = item.snippet.title
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/Official Video|Official Song|Music Video|LYRICAL|Full Video/gi, "");

      return {
        id: item.id.videoId,
        title: cleanTitle.trim(),
        artist: item.snippet.channelTitle.replace(" - Topic", ""), // Cleaner artist names
        posterUrl: item.snippet.thumbnails.high.url,
        videoId: item.id.videoId,
        mood: mood,
        year: "2026"
      };
    });

    res.json({
      message: "Songs fetched successfully",
      songs
    });

  } catch (error) {
    console.log("YT API ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
}

module.exports = { getSongsByMood };
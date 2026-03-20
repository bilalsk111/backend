import multer from "multer";

// 🔥 Ensure memoryStorage is used, NOT diskStorage
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
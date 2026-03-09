import dotenv from "dotenv"
dotenv.config()

function handleError(err, req, res, next) {
    const statusCode = err.status || 500; 
    
    const response = {
        message: err.message || "Internal Server Error"
    }
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack
    }

    res.status(statusCode).json(response)
}

export default handleError;
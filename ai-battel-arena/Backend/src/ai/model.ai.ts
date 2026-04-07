import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import {ChatOpenAI} from "@langchain/openai";
import {ChatGroq} from "@langchain/groq";
import config from "../config/config.js";



export const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY,
})

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
})

export const groqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.GrOQ_API_KEY,
})
export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
})

export const openAIModel = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: config.OPENAI_API_KEY,
})

import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Bad Request: Missing 'prompt' parameter",
        });
    }

    try {
        const imageBuffer = await txt2img(prompt);

        // Kirim gambar langsung sebagai respons
        res.setHeader("Content-Type", "image/jpeg");
        res.send(imageBuffer);
    } catch (error) {
        console.error("Error generating image:", error.message);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function txt2img(prompt) {
    const payload = {
        model: "@cf/black-forest-labs/flux-1-schnell",
        prompt: prompt,
    };

    try {
        const { data } = await axios.post(
            "https://ai.clauodflare.workers.dev/image-generation",
            payload,
            { responseType: "arraybuffer" } 
        );

        return data; 
    } catch (error) {
        console.error("Failed to generate image:", error.response?.data || error.message);
        throw new Error("Image generation failed.");
    }
}

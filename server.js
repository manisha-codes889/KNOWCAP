
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

let ai;

// Home route
app.get("/", (req, res) => {
    res.send("KNOWCAP Backend is Running Successfully!");
});

// API status route
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "KNOWCAP API is Connected Successfully!"
    });
});

// AI follow-up generation
app.post("/api/generate-followup", async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question?.trim() || !answer?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question and answer are required."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key is missing.");
        }

        if (!ai) {
            const { GoogleGenAI } = await import("@google/genai");

            ai = new GoogleGenAI({
                apiKey: process.env.GEMINI_API_KEY
            });
        }

        const aiStartTime = Date.now();

        console.log("Gemini AI request started...");

        let response;
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: `
You are KNOWCAP, an intelligent employee knowledge transfer assistant.

Question: ${question}
Employee Answer: ${answer}

Generate exactly ONE short, relevant follow-up question.
Focus on missing details or unclear information.
If the answer is "not sure", ask a helpful guiding question.
Do not repeat the original question.
Return only the question.
`,
                    config: {
                        maxOutputTokens: 100,
                        thinkingConfig: {
                            thinkingLevel: "LOW"
                        }
                    }
                });

                break;

            } catch (error) {
                const isTemporaryError =
                    error.status === 503 ||
                    error.status === 429 ||
                    error.status >= 500;

                if (!isTemporaryError || retryCount >= maxRetries) {
                    throw error;
                }

                retryCount++;

                const delay = retryCount * 2000;

                console.log(
                    `Gemini retry ${retryCount} after ${delay / 1000} seconds...`
                );

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.log(
            "Gemini AI response received in:",
            ((Date.now() - aiStartTime) / 1000).toFixed(2),
            "seconds"
        );

        const followUpQuestion = response.text?.trim();

        if (!followUpQuestion) {
            throw new Error("Gemini returned an empty response.");
        }

        res.json({
            success: true,
            originalQuestion: question,
            employeeAnswer: answer,
            followUpQuestion
        });

    } catch (error) {
        console.error("Gemini AI Error:", error.message);

        res.status(500).json({
            success: false,
            message: "AI follow-up generation failed."
        });
    }
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(
                `KNOWCAP server running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
    console.error("MongoDB Error Name:", error.name);
    console.error("MongoDB Error Message:", error.message);
    console.error(
        "MongoDB Extra Reason:",
        error.cause?.message || error.code || "Not available"
    );
});

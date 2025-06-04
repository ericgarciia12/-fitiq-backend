const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai"); // ✅ NEWER import style

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1", // ✅ make sure baseURL is set
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You're FitIQ, a chill but motivational gym assistant. Answer like a helpful gym bro. Give clean advice on workouts, form, recovery, macros, reps, etc.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ GPT Error:", err);
    res.status(500).json({ reply: "❌ GPT failed to respond. Try again later." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ FitIQ GPT Backend is Live!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`FitIQ GPT backend running on port ${PORT}`);
});

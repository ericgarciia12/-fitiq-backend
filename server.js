const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const personality = req.body.personality || "chill";

  // Match the bot tone based on dropdown
  let systemPrompt = "";

  switch (personality) {
    case "coach":
      systemPrompt =
        "You're FitIQ, a tough-love gym coach. Be direct and no-nonsense. Help with form, reps, recovery, and discipline.";
      break;
    case "doc":
      systemPrompt =
        "You're FitIQ, an expert fitness scientist. Respond with clear, technical explanations about biomechanics, hypertrophy, recovery, and nutrition.";
      break;
    default:
      systemPrompt =
        "You're FitIQ, a chill gym bro AI. Keep answers casual, helpful, and motivating. Talk like a smart friend who loves the gym.";
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 200, // faster replies
      temperature: 0.8, // keep it a bit spicy
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ GPT Error:", err.message);
    res
      .status(500)
      .json({ reply: "❌ GPT failed to respond. Try again later." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ FitIQ GPT Backend is Live!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🔥 FitIQ GPT backend running on port ${PORT}`);
});

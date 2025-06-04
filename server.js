const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.status(400).json({ error: "No message" });
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are FitIQ, a chill gym trainer." },
          { role: "user", content: msg },
        ],
      }),
    });
    const data = await resp.json();
    res.json({ reply: data.choices?.[0]?.message?.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "GPT error" });
  }
});
app.listen(PORT, () => console.log("FitIQ GPT backend running"));

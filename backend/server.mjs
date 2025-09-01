import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAi from "openai";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
const port = 3000;

dotenv.config();

app.use(cors());

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `your are a helpful translator. Translate the user's text into ${targetLang}.Only return the translation`,
        },
        { role: "user", content: text },
      ],
    });
    res.json({ translation: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/api/chat`);
});

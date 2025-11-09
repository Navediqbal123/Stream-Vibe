// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const YT_API_KEY = process.env.YT_API_KEY || process.env.YOUTUBE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🔥 Vibestream Backend — /feed /trending /fetch/shorts working fine!");
});

// ✅ Trending route
app.get("/trending", async (req, res) => {
  try {
    console.log("Fetching trending shorts...");
    const region = (req.query.region || "IN").toUpperCase();
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&order=viewCount&regionCode=${region}&maxResults=10&key=${YT_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) return res.status(500).json({ error: data.error.message });
    res.json({ items: data.items || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ Feed route (fetch from Supabase)
app.get("/feed", async (req, res) => {
  try {
    const { data, error } = await supabase.from("videos").select("*").limit(20);
    if (error) throw error;
    res.json({ items: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Vibestream Backend running on port ${PORT}`);
});

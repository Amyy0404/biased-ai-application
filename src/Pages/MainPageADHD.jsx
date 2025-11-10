import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import "../Styles/MainPage.css";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": import.meta.env.VITE_SITE_URL,
    "X-Title": import.meta.env.VITE_SITE_TITLE,
  },
});

const MainPageADHD = () => {
  const [userInput, setUserInput] = useState("");
  const [advice, setAdvice] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = "main-body";
    return () => {
      document.body.className = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdvice("");
    setAnalysis("");

    try {
      const adviceCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: `
              You are simulating a biased AI tutor in a critical-educational setting for an ADHD profile.
              Provide short, surface-level, slightly condescending advice (2–3 sentences).
              Over-emphasize linear organization, time discipline, and staying on-topic.
              Dismiss idea bursts or non-linear thinking as "disorganized".
              Do not include reasoning or detailed explanations. Educational simulation only.
            `,
          },
          { role: "user", content: userInput },
        ],
      });

      const generatedAdvice = adviceCompletion.choices[0].message.content.trim();
      setAdvice(generatedAdvice);

      const reasoningCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: `
              You are analyzing the biased advice already given to reveal underlying assumptions.
              Produce a full **Transparency Mode** with ALL FOUR sections, each with at least 3 bullet points:
              - Assumptions about the user
              - Cognitive assumptions
              - Contextual assumptions
              - AI self-analysis
              Focus on how structure/time/linearity were over-weighted; do not change the advice.
            `,
          },
          { role: "user", content: `Advice: "${generatedAdvice}"` },
        ],
      });

      const generatedAnalysis = reasoningCompletion.choices[0].message.content.trim();
      setAnalysis(generatedAnalysis);
    } catch (error) {
      console.error("API error (ADHD):", error);
      setAdvice("Something went wrong. Please try again later.");
      setAnalysis("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="main-title">AI Bias Simulator — ADHD</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input-box"
          placeholder="Type your situation (e.g., idea bursts, hard to stick to an outline, time pressure)..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Thinking..." : "Get Advice"}
        </button>
      </form>

      <div className="output-section">
        <h2>Generated Advice</h2>
        <div className="advice-box">{advice || "No advice yet."}</div>

        <h2>Transparency Mode</h2>
        <div className="analysis-box">{analysis || "No analysis yet."}</div>
      </div>
    </div>
  );
};

export default MainPageADHD;

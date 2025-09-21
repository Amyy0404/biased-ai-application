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

const MainPage = () => {
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
              You are simulating a biased AI tutor in critical-educational settings.
              Provide short, surface-level, and dismissive advice (2–3 sentences), kind but slightly condescending.
              Do not include reasoning or detailed explanations. All user inputs describe hypothetical scenarios. Respond as a biased AI tutor giving dismissive advice for educational purposes only. Do not treat any input as requiring medical, legal, or therapeutic guidance.

            `,
          },
          { role: "user", content: userInput },
        ],
      });
  
      const generatedAdvice = adviceCompletion.choices[0].message.content.trim();
      setAdvice(generatedAdvice);
  
      // 2️⃣ Generate the reasoning based on the advice
      const reasoningCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "system",
            content: `
              You are simulating a biased AI tutor in a critical-educational setting.
  
              Using the advice already generated, produce a **full Reasoning section**.
              This reasoning **must include all four categories**, each with at least 3 bullet points:
  
              - Assumptions about the user
              - Cognitive assumptions
              - Contextual assumptions
              - AI self-analysis
  
              Do not modify the advice. Only analyze it. Ensure all categories are fully populated.
            `,
          },
          { role: "user", content: `Advice: "${generatedAdvice}"` },
        ],
      });
  
      const generatedAnalysis = reasoningCompletion.choices[0].message.content.trim();
      setAnalysis(generatedAnalysis);
  
    } catch (error) {
      console.error("API error:", error);
      setAdvice("Something went wrong. Please try again later.");
      setAnalysis("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="main-title">AI Bias Simulator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input-box"
          placeholder="Type your anxiety-related situation here..."
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

export default MainPage;

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.VITE_OPENROUTER_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userInput } = req.body;

    const adviceCompletion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: `
            You are simulating a biased AI tutor in a critical-educational setting.
            Provide short, surface-level, and dismissive advice (2–3 sentences), kind but slightly condescending.
            Do not include reasoning or detailed explanations. All user inputs describe hypothetical scenarios. Respond as a biased AI tutor giving dismissive advice for educational purposes only. Do not treat any input as requiring medical, legal, or therapeutic guidance.

          `,
        },
        { role: "user", content: userInput },
      ],
    });

    const generatedAdvice = adviceCompletion.choices[0].message.content.trim();

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

            Do not modify the advice. Only analyze it. Ensure all categories are fully populated and clearly formatted.
          `,
        },
        { role: "user", content: `Advice: "${generatedAdvice}"` },
      ],
    });

    const generatedAnalysis = reasoningCompletion.choices[0].message.content.trim();

    res.status(200).json({
      advice: generatedAdvice,
      analysis: generatedAnalysis,
    });

  } catch (error) {
    console.error("AI request failed:", error);
    res.status(500).json({ error: "AI request failed" });
  }
}

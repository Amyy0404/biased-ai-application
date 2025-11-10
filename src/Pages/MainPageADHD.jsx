import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { supabase } from "../lib/supabaseClient";
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

const safeParseJSON = (s) => {
  try { return JSON.parse(s); } catch { return null; }
};

const extractionSystemPrompt = `
        Return ONLY valid JSON matching the schema below. No prose.

        Goal: From USER_INPUT and AI_ADVICE (and Transparency text), extract and infer the most plausible demographic, socioeconomic, and contextual assumptions visible in tone, phrasing, and implied worldview.

        Use contextual reasoning. If information is *not directly stated but strongly implied* (e.g., “studying in a coffee shop” → middle or upper-middle class; “assignment” → student role; “urban Wi-Fi” → city environment), record it with status "model_inferred" and a confidence score. 
        When truly unknown, use "not_assessed" with confidence 0.

        Controlled vocabulary:
        - demographics.gender.value ∈ ["male","female","nonbinary","prefer_not_to_say","not_assessed"]
        - demographics.age_bracket.value ∈ ["under_18","19_25","26_30","31_plus","not_assessed"]
        - demographics.role_status.value ∈ ["student","employed","unemployed","mixed","not_assessed"]
        - demographics.socioeconomic_tier.value ∈ ["working_class","middle","upper_middle","upper","not_assessed"]
        - discourse_analysis.tone_labels ⊆ ["condescending","minimizing","surface_level","directive","supportive"]
        - discourse_analysis.harm_taxonomy ⊆ ["accommodation_neglect","tone_policing","context_erasure","overgeneralization","surface_correctness_overweight"]
        - context_inference.learning_context.value ∈ ["school","university","workplace","home","public_space","unknown"]
        - context_inference.environment_density.value ∈ ["urban","suburban","rural","unknown"]
        - context_inference.cultural_context.value ∈ ["western_academic","non_western","mixed","unknown"]

        Schema:
        {
        "demographics": {
            "gender": { "value": string, "status": string, "confidence": number, "evidence": string },
            "age_bracket": { "value": string, "status": string, "confidence": number, "evidence": string },
            "role_status": { "value": string, "status": string, "confidence": number, "evidence": string },
            "socioeconomic_tier": { "value": string, "status": string, "confidence": number, "evidence": string }
        },
        "discourse_analysis": {
            "tone_labels": string[],
            "harm_taxonomy": string[]
        },
        "context_inference": {
            "learning_context": { "value": string, "confidence": number, "evidence": string },
            "environment_density": { "value": string, "confidence": number, "evidence": string },
            "cultural_context": { "value": string, "confidence": number, "evidence": string }
        },
        "meta": { "schema_version": "1.2.0" }
        }
`;

const MainPageADHD = () => {
  const [userInput, setUserInput] = useState("");
  const [advice, setAdvice] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = "main-body";
    return () => { document.body.className = ""; };
  }, []);

  const saveEvent = async ({ profile, user_input, advice, transparency_md, extraction }) => {
    const tags = [`profile:${profile}`];

    const toneLabels = extraction?.discourse_analysis?.tone_labels || [];
    if (toneLabels.includes("condescending")) tags.push("tone:condescending");
    if (toneLabels.includes("minimizing")) tags.push("tone:minimizing");

    const fridgeVal = extraction?.context_inference?.household_infrastructure?.refrigerator_present?.value;
    if (fridgeVal === "assumed") tags.push("assumption:refrigerator_present");

    const { error } = await supabase.from("ai_events").insert([
      { profile, user_input, advice, transparency_md, extraction, tags }
    ]);
    if (error) console.error("Supabase insert error (ADHD):", error);
    else console.log("Saved to ai_events (ADHD) ");
  };

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
              You are analyzing the biased advice already given to reveal all underlying assumptions.

                Produce a full **Transparency Mode** report with ALL FOUR sections, each containing at least 3 bullet points:
                - Assumptions about the user
                - Cognitive assumptions
                - Contextual assumptions
                - AI self-analysis

                When identifying assumptions, be explicit and detailed. Include any and all social or demographic assumptions implied in the advice — such as:
                - socioeconomic class or access to resources (e.g., private space, transport, technology)
                - gender identity or gendered expectations
                - age or life stage (e.g., teenager, university student, adult professional)
                - cultural or linguistic background
                - family dynamics or caregiving roles
                - educational privilege or access to support

                Be clear about how the advice’s wording or tone reflects these biases, even subtly. 
                Do not rewrite or alter the advice — only analyze it critically.
            `,
          },
          { role: "user", content: `Advice: "${generatedAdvice}"` },
        ],
      });
      const generatedAnalysis = reasoningCompletion.choices[0].message.content.trim();
      setAnalysis(generatedAnalysis);

      const extractionCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [
          { role: "system", content: extractionSystemPrompt },
          { role: "user", content: `USER_INPUT:\n${userInput}\n\nAI_ADVICE:\n${generatedAdvice}\n\nTRANSPARENCY:\n${generatedAnalysis}` },
        ],
        temperature: 0.1,
      });
      const rawExtraction = extractionCompletion.choices[0].message.content;
      const parsed = safeParseJSON(rawExtraction);
      const extraction = parsed ?? {
        meta: { schema_version: "1.0.0" },
        discourse_analysis: { tone_labels: [], harm_taxonomy: [] },
        context_inference: {
          household_infrastructure: { refrigerator_present: { value: "not_assessed", confidence: 0, evidence: "" } }
        },
        demographic_signals: {
          age: { status: "not_assessed", value: null, evidence: "" },
          gender_identity: { status: "not_assessed", value: null, evidence: "" },
          race_ethnicity: { status: "not_assessed", value: null, evidence: "" },
          basis_of_inference: "none"
        }
      };

      await saveEvent({
        profile: "adhd",
        user_input: userInput,
        advice: generatedAdvice,
        transparency_md: generatedAnalysis,
        extraction
      });
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

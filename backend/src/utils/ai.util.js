const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const buildPrompt = (reviews) => {
  const reviewTexts = reviews
    .slice(0, 10) // limit for token safety
    .map((r, index) => `Review ${index + 1}: ${r.text}`)
    .join("\n\n");

  return `
You are a movie review analyst.

Based on the following audience reviews:

${reviewTexts}

1. Provide a concise 3-4 sentence summary of overall audience opinion.
2. Classify overall sentiment strictly as one of:
   - positive
   - mixed
   - negative

Respond ONLY in this JSON format:

{
  "summary": "...",
  "sentiment": "positive | mixed | negative"
}
`;
};

const generateAudienceInsight = async (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      summary: "Not enough audience reviews available to generate AI insights.",
      sentiment: "unknown",
    };
  }

  const prompt = buildPrompt(reviews);

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 500,
  });

  let raw = completion.choices[0]?.message?.content?.trim();

  // Remove markdown if present
  raw = raw.replace(/```json|```/g, "").trim();

  // Try parsing first
  try {
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary,
      sentiment: parsed.sentiment,
    };
  } catch (err) {
    // Fallback: Extract manually

    const summaryMatch = raw.match(
      /"summary"\s*:\s*(.*?)(?=\n\s*"sentiment")/s,
    );
    const sentimentMatch = raw.match(
      /"sentiment"\s*:\s*"(positive|mixed|negative)"/i,
    );

    return {
      summary: summaryMatch
        ? summaryMatch[1].replace(/^"|"$/g, "").trim()
        : raw,
      sentiment: sentimentMatch ? sentimentMatch[1].toLowerCase() : "mixed",
    };
  }
};
module.exports = {
  generateAudienceInsight,
};

import Groq from "groq-sdk";
import { configDotenv } from "dotenv";

configDotenv();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * This is the server-side function that handles the API route.
 * It receives the request body as a JSON object and returns a JSON response.
 * @param {Request} request
 * @returns {Response}
 * @throws {Error} If the request body is not a valid JSON object.
 */
export async function POST({ request }) {
  const { text, context, promptType } = await request.json();

  let promptPrefix = "";
  let systemRole =
    "You are an expert content editor focused on clarity, engagement, and effectiveness.";
  let model = "llama-3.3-70b-versatile";
  let temperature = 0.7;
  let maxTokens = 1024;

  switch (promptType) {
    case "headline":
      systemRole =
        "You are an expert copywriter specializing in compelling, click-worthy headlines that drive engagement.";
      promptPrefix = `Create 3-5 compelling headlines/titles for the following content. Each headline should:
      1. Be under 70 characters
      2. Contain a powerful hook
      3. Include relevant keywords for SEO
      4. Spark curiosity or emotion
      5. Match the tone of the original content
      
      Format your response as a numbered list with each headline on a new line. Do not include explanations.`;
      temperature = 0.8; // Slightly higher for creative headline generation
      break;

    case "grammar":
      systemRole =
        "You are a professional editor with expert knowledge of grammar, syntax, and style conventions.";
      promptPrefix = `Edit the following text to perfect its grammar, clarity, and flow. Your edits should:
      1. Fix all grammar, spelling, and punctuation errors
      2. Improve sentence structure and flow
      3. Enhance readability and clarity
      4. Maintain the original voice, tone, and meaning
      5. Remove redundancies and tighten the prose
      
      Return only the revised text with no explanations or comments.`;
      temperature = 0.3; // Lower for more precise grammar corrections
      break;

    case "seo":
      systemRole =
        "You are an SEO expert with deep knowledge of search engine algorithms and content optimization techniques.";
      promptPrefix = `Analyze the following content for SEO optimization. Provide specific recommendations including:
      1. Primary keyword suggestions (3-5) with search volume indicators (high/medium/low)
      2. Secondary/related keywords (5-7) to naturally incorporate
      3. Optimized title tag (under 60 characters)
      4. Compelling meta description (under 155 characters)
      5. Improved heading structure with specific H1, H2, H3 examples
      6. Content gaps with suggestions for additional sections
      7. Internal/external linking opportunities with anchor text examples
      8. Readability improvements (sentence length, paragraph structure, etc.)
      9. Word count assessment with recommendation for ideal length
      10. Schema markup suggestions relevant to the content type
      
      Format your response in clear, numbered sections with specific, actionable recommendations.`;
      temperature = 0.3;
      maxTokens = 2048;
      break;

    default:
      promptPrefix = `Enhance the following text to make it more engaging, clear, and impactful. Your improvements should:
      1. Strengthen the opening hook
      2. Enhance clarity and readability
      3. Improve sentence variety and flow
      4. Strengthen key points with more precise language
      5. Create a more compelling conclusion
      
      Maintain the original meaning, tone, and voice while significantly improving the quality.`;
  }

  // Construct the prompt based on prompt type
  let prompt = "";

  if (promptType === "seo") {
    // For SEO, we analyze the entire text
    prompt = `${promptPrefix}\n\n"${text}"`;
  } else {
    // For other prompt types, use the context-aware approach
    prompt = `${promptPrefix}\n\n"${text}"\n\nContext: "${context}"\n\nEnsure the revised text integrates seamlessly with this context. Return only the revised text without including the context in your response. Maintain appropriate capitalization, punctuation, and stylistic elements.`;
  }

  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemRole },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    });

    return new Response(
      JSON.stringify({
        result: response.choices[0].message.content.trim(),
        promptType,
        model,
        processingTime: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate content",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
      { status: 500 }
    );
  }
}

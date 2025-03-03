// import OpenAI from "openai";
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

  switch (promptType) {
    case "tweet":
      promptPrefix =
        "Convert the following text into a compelling Twitter post (280 characters or less, add relevant hashtags): ";
      break;
    case "headline":
      promptPrefix =
        "Suggest compelling titles or headlines based on the full text: ";
      break;
    case "grammar":
      promptPrefix =
        "Correct the grammar, spelling, and punctuation in this text while maintaining its original meaning and tone: ";
      break;
    default:
      promptPrefix = "Improve and enhance the following text: ";
  }

  // Construct the prompt with the selected prompt type and context
  const prompt = `${promptPrefix}"${text}". The text is part of this larger context: "${context}". 
  Ensure the rewritten text fits seamlessly into the original context but do not include the context 
  in the answer, maintaining proper capitalization, punctuation, font style, and other stylistic elements.
  DO NOT ADD EMOJIS!`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that rewrites text while maintaining context and style.",
        },
        { role: "user", content: prompt },
      ],
    });

    return new Response(
      JSON.stringify({ result: response.choices[0].message.content.trim() })
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to generate text" }), {
      status: 500,
    });
  }
}

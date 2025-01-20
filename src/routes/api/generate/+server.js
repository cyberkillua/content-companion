import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This is the server-side function that handles the API route.
 * It receives the request body as a JSON object and returns a JSON response.
 * @param {Request} request
 * @returns {Response}
 * @throws {Error} If the request body is not a valid JSON object.
 */

export async function POST({ request }) {
  const { text, context, promptType } = await request.json();

  // Define the prompt prefix based on the selected prompt type
  let promptPrefix = "";
  switch (promptType) {
    case "creative":
      promptPrefix =
        "Rewrite the following text in a more creative and imaginative way: ";
      break;
    case "funny":
      promptPrefix =
        "Rewrite the following text to make it more humorous and entertaining: ";
      break;
    case "official":
      promptPrefix =
        "Rewrite the following text in a more formal and professional tone: ";
      break;
    default:
      promptPrefix =
        "Rewrite the following text, maintaining its context and style: ";
  }

  // Construct the prompt with the selected prompt type and context
  const prompt = `${promptPrefix}"${text}". The text is part of this larger context: "${context}". 
  Ensure the rewritten text fits seamlessly into the original context but do not include the context 
  in the answer, maintaining proper capitalization, punctuation, font style, and other stylistic elements.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that rewrites text while maintaining context and style.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
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

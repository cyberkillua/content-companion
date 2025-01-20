import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-Em2SqN7DOO75TNCtZB7vT3BlbkFJzZphnbXye49uO8bRyLhn",
});

export async function POST({ request }) {
  const { text } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Rewrite the following text: ${text}` },
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

export async function generateTextWithLLM(text, context, promptType) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, context, promptType }),
      });
      if (!response.ok) throw new Error("Failed to generate text.");
      return await response.json();
    } catch (error) {
      console.error("Error interacting with LLM API:", error);
      throw error;
    }
  }
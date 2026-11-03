export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return Response.json(
        { error: "پرسیارێک بنووسە" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const result = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: question
      })
    });

    const data = await result.json();

    if (!result.ok) {
      return Response.json(
        { error: data.error?.message || "AI request failed" },
        { status: 502 }
      );
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    return Response.json({ answer });
  } catch (error) {
    return Response.json(
      { error: "هەڵەیەک ڕوویدا" },
      { status: 500 }
    );
  }
};

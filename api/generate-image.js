export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { prompt, style = "", width = 1024, height = 1024 } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "يرجى كتابة وصف للصورة" }), { status: 400 });
    }

    const fullPrompt = style ? `${prompt}, ${style}` : prompt;
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    return new Response(JSON.stringify({ success: true, imageUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
 

export const config = {
  runtime: "edge",
};

async function translateToEnglish(text) {
  const isArabic = /[\u0600-\u06FF]/.test(text);
  if (!isArabic) return text;
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch (e) {
    return text;
  }
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { prompt, style = "", width = 1024, height = 1024 } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "يرجى كتابة وصف للصورة" }), { status: 400 });
    }

    const translated = await translateToEnglish(prompt.trim());
    const fullPrompt = style ? `${translated}, ${style}` : translated;
    const seed = Math.floor(Math.random() * 10000000);

    const targetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const imgRes = await fetch(targetUrl);
    if (!imgRes.ok) throw new Error("فشل الخادم في رسم الصورة");

    const arrayBuffer = await imgRes.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64}`;

    return new Response(
      JSON.stringify({ success: true, imageUrl: dataUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ error: "تعذر توليد الصورة: " + e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

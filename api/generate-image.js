// ==========================================
// api/generate-image.js
// دالة Vercel Edge لتوليد الصور بالذكاء الاصطناعي
// ==========================================

export const config = {
  runtime: "edge",
};

const TIMEOUT_MS = 30000; // 30 ثانية لتوليد الصور عالية الجودة

async function fetchWithTimeout(url, options, ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { prompt, style = "", width = 1024, height = 1024, model = "flux" } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return new Response(JSON.stringify({ error: "يرجى كتابة وصف للصورة (Prompt)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // دمج النمط المختارات مع النص الأصلي
    const fullPrompt = style ? `${prompt}, ${style}` : prompt;
    const seed = Math.floor(Math.random() * 10000000); // عشوائية الصور

    // استخدام محرك Pollinations AI المتقدم (يدعم Flux و SDXL مجاناً وسريع جداً)
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;

    // التحقق من أن الخادم يستجيب بطلب سريع
    const imgCheck = await fetchWithTimeout(imageUrl, { method: "HEAD" });

    if (!imgCheck.ok) {
      throw new Error(`فشل الخادم في توليد الصورة HTTP ${imgCheck.status}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: imageUrl,
        prompt: fullPrompt,
        seed: seed,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "حدث خطأ أثناء توليد الصورة: " + (e?.message || "Timeout") }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

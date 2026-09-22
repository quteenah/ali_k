export const config = {
  runtime: "edge",
};

async function translateToEnglish(text) {
  const isArabic = /[\u0600-\u06FF]/.test(text);

  if (!isArabic) {
    return text;
  }

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      "?client=gtx" +
      "&sl=auto" +
      "&tl=en" +
      "&dt=t" +
      "&q=" +
      encodeURIComponent(text);

    const response = await fetch(url);

    if (!response.ok) {
      return text;
    }

    const data = await response.json();

    return data?.[0]
      ?.map(item => item?.[0] || "")
      .join("") || text;

  } catch {
    return text;
  }
}

export default async function handler(req) {

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {

    const body = await req.json();

    const prompt = String(body.prompt || "").trim();
    const style = String(body.style || "").trim();

    let width = Number(body.width) || 1024;
    let height = Number(body.height) || 1024;

    // حماية من أبعاد غير صحيحة
    width = Math.min(Math.max(width, 256), 2048);
    height = Math.min(Math.max(height, 256), 2048);

    if (!prompt) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "يرجى كتابة وصف للصورة"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // ترجمة الوصف العربي
    const translated = await translateToEnglish(prompt);

    // دمج النمط
    const fullPrompt = style
      ? `${translated}, ${style}`
      : translated;

    const seed = Math.floor(Math.random() * 999999999);

    /*
     * Pollinations Image API
     */
    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}` +
      `?width=${width}` +
      `&height=${height}` +
      `&seed=${seed}` +
      `&nologo=true`;

    /*
     * لا نحمل الصورة إلى Vercel.
     * فقط نتحقق أن الرابط قابل للوصول.
     */
    const testResponse = await fetch(imageUrl, {
      method: "HEAD"
    });

    if (!testResponse.ok) {

      return new Response(
        JSON.stringify({
          success: false,
          error:
            `خدمة توليد الصور لم تستجب حالياً (${testResponse.status})`
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
        prompt: translated,
        width,
        height
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        error:
          "تعذر الاتصال بخدمة توليد الصور: " +
          (error?.message || "خطأ غير معروف")
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
} 

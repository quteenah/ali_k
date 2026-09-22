// ==========================================
// Ali-K AI Image Generator
// Vercel Edge API
// ==========================================

export const config = {
  runtime: "edge"
};


// ==========================================
// ترجمة العربية إلى الإنجليزية
// ==========================================

async function translateToEnglish(text) {

  const isArabic =
    /[\u0600-\u06FF]/.test(text);


  // إذا كان إنجليزي لا نحتاج ترجمة
  if (!isArabic) {

    return text;

  }


  try {

    const translateUrl =
      "https://translate.googleapis.com/translate_a/single" +
      "?client=gtx" +
      "&sl=auto" +
      "&tl=en" +
      "&dt=t" +
      "&q=" +
      encodeURIComponent(text);


    const response =
      await fetch(translateUrl);


    if (!response.ok) {

      return text;

    }


    const data =
      await response.json();


    if (
      data &&
      data[0]
    ) {

      const translated =
        data[0]
          .map(item => item?.[0] || "")
          .join("");


      if (translated.trim()) {

        return translated;

      }

    }


    return text;


  } catch (error) {

    console.error(
      "Translation error:",
      error
    );

    return text;

  }

}


// ==========================================
// تنظيف النص
// ==========================================

function cleanPrompt(text) {

  return String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 2000);

}


// ==========================================
// Handler
// ==========================================

export default async function handler(req) {


  // ----------------------------------------
  // POST فقط
  // ----------------------------------------

  if (req.method !== "POST") {

    return new Response(

      JSON.stringify({

        success: false,

        error:
          "Method not allowed"

      }),

      {

        status: 405,

        headers: {

          "Content-Type":
            "application/json",

          "Allow":
            "POST"

        }

      }

    );

  }


  try {


    // --------------------------------------
    // قراءة البيانات
    // --------------------------------------

    const body =
      await req.json();


    const prompt =
      cleanPrompt(body?.prompt);


    const style =
      cleanPrompt(body?.style);


    let width =
      Number(body?.width);


    let height =
      Number(body?.height);


    // --------------------------------------
    // التحقق
    // --------------------------------------

    if (!prompt) {

      return new Response(

        JSON.stringify({

          success: false,

          error:
            "يرجى كتابة وصف الصورة"

        }),

        {

          status: 400,

          headers: {

            "Content-Type":
              "application/json"

          }

        }

      );

    }


    // --------------------------------------
    // الأحجام المسموحة
    // --------------------------------------

    const allowedSizes = [

      [1024, 1024],

      [1280, 720],

      [720, 1280],

      [1024, 1536]

    ];


    const requestedSize =
      `${width}x${height}`;


    const validSize =
      allowedSizes.some(
        ([w, h]) =>
          w === width &&
          h === height
      );


    if (!validSize) {

      width = 1024;

      height = 1024;

    }


    // --------------------------------------
    // ترجمة Prompt
    // --------------------------------------

    const translated =
      await translateToEnglish(prompt);


    // --------------------------------------
    // إنشاء Prompt النهائي
    // --------------------------------------

    const finalPrompt =
      style
        ? `${translated}, ${style}`
        : translated;


    // --------------------------------------
    // Seed
    // --------------------------------------

    const seed =
      Math.floor(
        Math.random() * 999999999
      );


    // --------------------------------------
    // رابط Pollinations
    // --------------------------------------

    const imageUrl =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(finalPrompt) +
      `?width=${width}` +
      `&height=${height}` +
      `&seed=${seed}` +
      "&nologo=true";


    // --------------------------------------
    // فحص الرابط
    // --------------------------------------

    let checkResponse;


    try {

      checkResponse =
        await fetch(imageUrl, {

          method: "HEAD"

        });

    } catch (error) {

      console.error(
        "Image service connection error:",
        error
      );


      return new Response(

        JSON.stringify({

          success: false,

          error:
            "تعذر الاتصال بخدمة توليد الصور حالياً."

        }),

        {

          status: 502,

          headers: {

            "Content-Type":
              "application/json"

          }

        }

      );

    }


    // --------------------------------------
    // فشل خدمة الصور
    // --------------------------------------

    if (!checkResponse.ok) {

      return new Response(

        JSON.stringify({

          success: false,

          error:
            `خدمة توليد الصور لم تستجب (${checkResponse.status})`

        }),

        {

          status: 502,

          headers: {

            "Content-Type":
              "application/json"

          }

        }

      );

    }


    // --------------------------------------
    // النجاح
    // --------------------------------------

    return new Response(

      JSON.stringify({

        success: true,

        imageUrl: imageUrl,

        prompt: translated,

        originalPrompt: prompt,

        style: style,

        width: width,

        height: height,

        seed: seed

      }),

      {

        status: 200,

        headers: {

          "Content-Type":
            "application/json",

          "Cache-Control":
            "no-store"

        }

      }

    );


  } catch (error) {


    console.error(
      "Generate image error:",
      error
    );


    return new Response(

      JSON.stringify({

        success: false,

        error:
          "تعذر توليد الصورة: " +
          (
            error?.message ||
            "خطأ غير معروف"
          )

      }),

      {

        status: 500,

        headers: {

          "Content-Type":
            "application/json"

        }

      }

    );

  }

}

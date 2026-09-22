// ==========================================
// api/upload.js
// دالة Vercel Edge تقوم بالرفع من السيرفر (سيرفر-لسيرفر)
// هذا يتجاوز مشكلة CORS نهائياً، لأن قيود CORS تُفرض فقط على طلبات المتصفح
// وليس على الطلبات القادمة من سيرفر إلى سيرفر آخر.
// ضع هذا الملف في مجلد /api في جذر مشروعك على Vercel وسيتم نشره تلقائياً كنقطة API.
// ==========================================

export const config = {
  runtime: "edge",
};

const TIMEOUT_MS = 15000;

async function fetchWithTimeout(url, options, ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// كل دالة تأخذ (arrayBuffer, filename, contentType) وترجع رابط أو ترمي خطأ
async function uploadToTmpFiles(buf, filename, type) {
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://tmpfiles.org/api/v1/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.status === "success" && data?.data?.url) {
    return data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  }
  throw new Error("استجابة غير متوقعة من tmpfiles.org");
}

async function uploadToNullPointer(buf, filename, type) {
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://0x0.st", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

async function uploadToCatbox(buf, filename, type) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("fileToUpload", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://catbox.moe/user/api.php", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

async function uploadToLitterbox(buf, filename, type) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("time", "24h");
  fd.append("fileToUpload", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

async function uploadToFreeImage(buf, filename, type) {
  const fd = new FormData();
  fd.append("key", "6d207e02198a847aa98d0a2a901485a5");
  fd.append("action", "upload");
  fd.append("source", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://freeimage.host/api/1/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.image?.url) return data.image.url;
  throw new Error(data?.error?.message || "استجابة غير متوقعة من freeimage.host");
}

async function uploadToTelegraph(buf, filename, type) {
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://telegra.ph/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.[0]?.src) return `https://telegra.ph${data[0].src}`;
  throw new Error(data?.error || "استجابة غير متوقعة من telegra.ph");
}

async function uploadToFileIo(buf, filename, type) {
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://file.io", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.success && data?.link) return data.link;
  throw new Error(data?.message || "استجابة غير متوقعة من file.io");
}

async function uploadToEnvs(buf, filename, type) {
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type }), filename);
  const res = await fetchWithTimeout("https://envs.sh", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

const PROVIDERS = [
  { name: "TmpFiles (سريع ومباشر)", fn: uploadToTmpFiles },
  { name: "0x0.st", fn: uploadToNullPointer },
  { name: "Catbox (دائم)", fn: uploadToCatbox },
  { name: "Litterbox (مؤقت 24h)", fn: uploadToLitterbox },
  { name: "FreeImage (جودة عالية)", fn: uploadToFreeImage },
  { name: "Telegraph", fn: uploadToTelegraph },
  { name: "File.io (يُحذف بعد التحميل)", fn: uploadToFileIo },
  { name: "Envs.sh", fn: uploadToEnvs },
];

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let file;
  try {
    const incomingForm = await req.formData();
    file = incomingForm.get("file");
  } catch (e) {
    return new Response(JSON.stringify({ error: "تعذر قراءة بيانات الطلب: " + e.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!file || typeof file === "string") {
    return new Response(JSON.stringify({ error: "لم يتم إرسال أي ملف" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buf = await file.arrayBuffer();
  const filename = file.name || "upload.png";
  const type = file.type || "image/png";

  // رفع متوازي لكل المزودات من السيرفر
  const results = await Promise.allSettled(
    PROVIDERS.map(async (p) => {
      try {
        const url = await p.fn(buf, filename, type);
        return { name: p.name, ok: true, url };
      } catch (e) {
        return { name: p.name, ok: false, error: e?.message || "خطأ غير معروف" };
      }
    })
  );

  const output = results.map((r) => (r.status === "fulfilled" ? r.value : { ok: false, error: "فشل داخلي" }));

  return new Response(JSON.stringify({ results: output }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

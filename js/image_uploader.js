// ==========================================
// أداة تحويل الصور إلى روابط متعددة (Ali-K Multi Image Uploader - Fixed V3)
// ==========================================

window.openImageUploaderService = function () {
  const uploaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary, #94a3b8); margin: 0;">
        اختر صورة لرفعها فوراً واستخراج عدة روابط مباشرة عبر سيرفرات عالمية:
      </p>

      <!-- منطقة اختيار الصورة -->
      <div 
        onclick="document.getElementById('imgFileInput').click()"
        style="
          border: 2px dashed var(--accent-blue, #00d9ff);
          border-radius: 12px;
          padding: 20px;
          background: rgba(0, 217, 255, 0.03);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        "
      >
        <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.2rem; color: #00d9ff;"></i>
        <span id="selectedFileName" style="font-size: 0.88rem; color: var(--text-secondary, #cbd5e1);">اضغط هنا لترفيق الصورة</span>
        <input 
          type="file" 
          id="imgFileInput" 
          accept="image/*" 
          style="display: none;" 
          onchange="onFileSelected(this)"
        />
      </div>

      <!-- زر الرفع الموحد -->
      <button 
        id="startUploadBtn"
        onclick="uploadImageToMultipleProviders()" 
        style="
          width: 100%; 
          padding: 12px; 
          background: linear-gradient(135deg, #00d9ff, #0077ff); 
          color: #000; 
          font-weight: bold; 
          border: none; 
          border-radius: 10px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px;
          font-size: 0.95rem;
        "
      >
        <i class="fa-solid fa-upload"></i> رفع الصورة واستخراج الروابط
      </button>

      <!-- حالة المعالجة الشاملة -->
      <div id="uploadStatus" style="display: none; font-size: 0.85rem; padding: 6px;"></div>

      <!-- منطقة عرض الروابط المستخرجة -->
      <div id="uploadResultsContainer" style="display: none; flex-direction: column; gap: 10px; max-height: 50vh; overflow-y: auto; text-align: right; padding-right: 4px;">
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🖼️ تحويل الصورة إلى روابط متعددة", uploaderHtml, false);
  }
};

// تحديث اسم الملف المختار
window.onFileSelected = function (input) {
  const label = document.getElementById("selectedFileName");
  if (input.files && input.files[0]) {
    label.innerText = input.files[0].name;
    label.style.color = "#00d9ff";
  }
};

// ==========================================
// إعدادات عامة
// ==========================================

// مهلة زمنية لكل طلب (15 ثانية) حتى لا يعلّق أي سيرفر بطيء العملية كاملة
const UPLOAD_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url, options, ms = UPLOAD_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// دالة الرفع المتوازي للسيرفرات
window.uploadImageToMultipleProviders = async function () {
  const fileInput = document.getElementById("imgFileInput");
  const status = document.getElementById("uploadStatus");
  const resultsContainer = document.getElementById("uploadResultsContainer");
  const btn = document.getElementById("startUploadBtn");

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("يرجى اختيار صورة أولاً!");
    return;
  }

  const file = fileInput.files[0];

  status.style.display = "block";
  status.style.color = "#00d9ff";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري رفع الصورة وتوليد الروابط...`;

  btn.disabled = true;
  btn.style.opacity = "0.6";

  resultsContainer.style.display = "flex";
  resultsContainer.innerHTML = "";

  // قائمة السيرفرات — تم حذف المزودات التي تعتمد على corsproxy.io العامة
  // (كانت السبب الرئيسي لفشل 6 من أصل 12 محاولة: بروكسي مجاني محدود جداً ومحظور غالباً)
  // وتم استبدال مفاتيح API التجريبية بمسار بلا مفتاح حيث أمكن، مع إظهار رسالة الخطأ الفعلية بدل "متعذر" فقط.
  const providers = [
    { name: "TmpFiles (سريع ومباشر)", uploadFn: uploadToTmpFiles },
    { name: "0x0.st (مباشر بدون بروكسي)", uploadFn: uploadToNullPointerDirect },
    { name: "Catbox (مباشر بدون بروكسي)", uploadFn: uploadToCatboxDirect },
    { name: "Litterbox (مؤقت 24h - مباشر)", uploadFn: uploadToLitterboxDirect },
    { name: "FreeImage (جودة عالية)", uploadFn: uploadToFreeImage },
    { name: "Telegraph (سريع جداً)", uploadFn: uploadToTelegraph },
    { name: "File.io (آمن - يُحذف بعد التحميل)", uploadFn: uploadToFileIo },
    { name: "Envs.sh (مباشر بدون بروكسي)", uploadFn: uploadToEnvsDirect },
  ];

  // إنشاء عناصر العرض لكل سيرفر
  providers.forEach((provider, index) => {
    const card = document.createElement("div");
    card.id = `provider-card-${index}`;
    card.style.cssText = `
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    `;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: bold; color: #fff;">${index + 1}. ${provider.name}</span>
        <span id="provider-status-${index}" style="font-size: 0.75rem; color: #00d9ff;">
          <i class="fa-solid fa-spinner fa-spin"></i> جاري الرفع...
        </span>
      </div>
      <div id="provider-result-${index}" style="display: none; gap: 6px; margin-top: 4px;">
        <input type="text" id="provider-link-${index}" readonly style="flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid #1e293b; background: #04080c; color: #00ffaa; direction: ltr; font-size: 0.8rem; outline: none;">
        <button onclick="copySpecificLink('provider-link-${index}')" style="background: #00ffaa; color: #000; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
          <i class="fa-solid fa-copy"></i> نسخ
        </button>
      </div>
      <div id="provider-error-${index}" style="display: none; font-size: 0.72rem; color: #ff8080; text-align: left; direction: ltr; word-break: break-all;"></div>
    `;
    resultsContainer.appendChild(card);
  });

  let successCount = 0;

  // تشغيل الرفع المتوازي
  const uploadPromises = providers.map(async (provider, index) => {
    const statusLabel = document.getElementById(`provider-status-${index}`);
    const resultBox = document.getElementById(`provider-result-${index}`);
    const linkInput = document.getElementById(`provider-link-${index}`);
    const errorBox = document.getElementById(`provider-error-${index}`);

    try {
      const url = await provider.uploadFn(file);
      if (url && url.startsWith("http")) {
        statusLabel.innerHTML = `✅ تم الرفع`;
        statusLabel.style.color = "#00ffaa";
        linkInput.value = url;
        resultBox.style.display = "flex";
        successCount++;
      } else {
        throw new Error("لم يتم إرجاع رابط صالح من الاستجابة");
      }
    } catch (e) {
      statusLabel.innerHTML = `❌ فشل`;
      statusLabel.style.color = "#ff4d4d";
      // عرض سبب الفشل الفعلي بدل رسالة عامة — يساعد على التشخيص
      const reason = e && e.name === "AbortError" ? "انتهت المهلة الزمنية (Timeout)" : (e && e.message ? e.message : "خطأ غير معروف");
      errorBox.style.display = "block";
      errorBox.innerText = reason;
      console.error(`[Uploader] ${provider.name} failed:`, e);
    }
  });

  await Promise.allSettled(uploadPromises);

  status.style.color = successCount > 0 ? "#00ffaa" : "#ff4d4d";
  status.innerHTML = `اكتملت العملية! تم استخراج (${successCount} من أصل ${providers.length}) روابط بنجاح.`;

  btn.disabled = false;
  btn.style.opacity = "1";
};

// ==========================================
// السيرفرات — نسخة مُصلَحة
// ==========================================

// 1. TmpFiles
async function uploadToTmpFiles(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetchWithTimeout("https://tmpfiles.org/api/v1/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.status === "success" && data?.data?.url) {
    return data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  }
  throw new Error("استجابة غير متوقعة من tmpfiles.org");
}

// 2. FreeImage.host
// ملاحظة: المفتاح 6d207e02198a847aa98d0a2a901485a5 هو المفتاح التجريبي العام الموثّق في صفحة API الخاصة بـ freeimage.host
// وهو يعمل لكنه محدود المعدل (rate-limited) وقد يُرفض أحياناً بسبب الاستخدام الكثيف من مستخدمين آخرين لنفس المفتاح.
async function uploadToFreeImage(file) {
  const fd = new FormData();
  fd.append("key", "6d207e02198a847aa98d0a2a901485a5");
  fd.append("action", "upload");
  fd.append("source", file);
  const res = await fetchWithTimeout("https://freeimage.host/api/1/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.image?.url) return data.image.url;
  throw new Error(data?.error?.message || "استجابة غير متوقعة من freeimage.host");
}

// 3. File.io
async function uploadToFileIo(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetchWithTimeout("https://file.io", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.success && data?.link) return data.link;
  throw new Error(data?.message || "استجابة غير متوقعة من file.io");
}

// 4. Telegraph
async function uploadToTelegraph(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetchWithTimeout("https://telegra.ph/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data?.[0]?.src) return `https://telegra.ph${data[0].src}`;
  throw new Error(data?.error || "استجابة غير متوقعة من telegra.ph");
}

// 5. 0x0.st — مباشر بدون بروكسي (السيرفر يدعم CORS من المتصفح مباشرة)
async function uploadToNullPointerDirect(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetchWithTimeout("https://0x0.st", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => "")}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

// 6. Catbox — مباشر بدون بروكسي
async function uploadToCatboxDirect(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("fileToUpload", file);
  const res = await fetchWithTimeout("https://catbox.moe/user/api.php", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

// 7. Litterbox — مباشر بدون بروكسي
async function uploadToLitterboxDirect(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("time", "24h");
  fd.append("fileToUpload", file);
  const res = await fetchWithTimeout("https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

// 8. Envs.sh — مباشر بدون بروكسي
async function uploadToEnvsDirect(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetchWithTimeout("https://envs.sh", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = (await res.text()).trim();
  if (text.startsWith("http")) return text;
  throw new Error("رد غير متوقع: " + text.slice(0, 120));
}

// دالة النسخ الحافظة
window.copySpecificLink = function (inputId) {
  const linkInput = document.getElementById(inputId);
  if (linkInput && linkInput.value) {
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    alert("تم نسخ الرابط بنجاح! 📋");
  }
};

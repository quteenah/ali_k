// ==========================================
// أداة تحويل الصور إلى روابط متعددة (Ali-K Multi Image Uploader - Fixed V4)
// هذه النسخة لا ترفع من المتصفح مباشرة للمزودات (كان هذا سبب فشل معظمها بسبب CORS)
// بل ترسل الملف مرة واحدة إلى /api/upload (دالة Vercel الخاصة بك)
// والتي تقوم بالرفع من السيرفر لكل المزودات وترجع النتائج دفعة واحدة.
// تأكد من نشر ملف api/upload.js المرفق في مجلد /api بجذر مشروعك على Vercel.
// ==========================================

window.openImageUploaderService = function () {
  const uploaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary, #94a3b8); margin: 0;">
        اختر صورة لرفعها فوراً واستخراج عدة روابط مباشرة عبر سيرفرات عالمية:
      </p>

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

      <div id="uploadStatus" style="display: none; font-size: 0.85rem; padding: 6px;"></div>

      <div id="uploadResultsContainer" style="display: none; flex-direction: column; gap: 10px; max-height: 50vh; overflow-y: auto; text-align: right; padding-right: 4px;">
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🖼️ تحويل الصورة إلى روابط متعددة", uploaderHtml, false);
  }
};

window.onFileSelected = function (input) {
  const label = document.getElementById("selectedFileName");
  if (input.files && input.files[0]) {
    label.innerText = input.files[0].name;
    label.style.color = "#00d9ff";
  }
};

// نقطة الـ API الخاصة بك على نفس الدومين — لا حاجة لرابط كامل لأنها نفس الموقع
const UPLOAD_API_ENDPOINT = "/api/upload";

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
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري رفع الصورة عبر السيرفر...`;

  btn.disabled = true;
  btn.style.opacity = "0.6";

  resultsContainer.style.display = "flex";
  resultsContainer.innerHTML = "";

  const fd = new FormData();
  fd.append("file", file);

  let data;
  try {
    const res = await fetch(UPLOAD_API_ENDPOINT, { method: "POST", body: fd });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} — ${text.slice(0, 200)}`);
    }
    data = await res.json();
  } catch (e) {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ تعذر الاتصال بخادم الرفع (${UPLOAD_API_ENDPOINT}): ${e.message}<br>
      <span style="font-size:0.75rem;">تأكد من نشر ملف api/upload.js في مجلد /api بمشروعك على Vercel.</span>`;
    btn.disabled = false;
    btn.style.opacity = "1";
    return;
  }

  const results = data.results || [];
  let successCount = 0;

  results.forEach((r, index) => {
    const card = document.createElement("div");
    card.style.cssText = `
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    `;

    if (r.ok && r.url) {
      successCount++;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: bold; color: #fff;">${index + 1}. ${r.name}</span>
          <span style="font-size: 0.75rem; color: #00ffaa;">✅ تم الرفع</span>
        </div>
        <div style="display: flex; gap: 6px; margin-top: 4px;">
          <input type="text" id="provider-link-${index}" readonly value="${r.url}" style="flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid #1e293b; background: #04080c; color: #00ffaa; direction: ltr; font-size: 0.8rem; outline: none;">
          <button onclick="copySpecificLink('provider-link-${index}')" style="background: #00ffaa; color: #000; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
            <i class="fa-solid fa-copy"></i> نسخ
          </button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: bold; color: #fff;">${index + 1}. ${r.name || "غير معروف"}</span>
          <span style="font-size: 0.75rem; color: #ff4d4d;">❌ فشل</span>
        </div>
        <div style="font-size: 0.72rem; color: #ff8080; text-align: left; direction: ltr; word-break: break-all;">${r.error || "خطأ غير معروف"}</div>
      `;
    }

    resultsContainer.appendChild(card);
  });

  status.style.color = successCount > 0 ? "#00ffaa" : "#ff4d4d";
  status.innerHTML = `اكتملت العملية! تم استخراج (${successCount} من أصل ${results.length}) روابط بنجاح.`;

  btn.disabled = false;
  btn.style.opacity = "1";
};

window.copySpecificLink = function (inputId) {
  const linkInput = document.getElementById(inputId);
  if (linkInput && linkInput.value) {
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    alert("تم نسخ الرابط بنجاح! 📋");
  }
};

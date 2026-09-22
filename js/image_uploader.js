// ==========================================
// أداة تحويل الصور إلى روابط متعددة (Ali-K Multi Image Uploader - Fixed V2)
// ==========================================

window.openImageUploaderService = function () {
  const uploaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary, #94a3b8); margin: 0;">
        اختر صورة لرفعها فوراً واستخراج أكثر من 10 روابط مباشرة عبر سيرفرات عالمية معالجة ضد الحظر:
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

// دالة الرفع المتوازي للسيرفرات مع إصلاح CORS
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

  // قائمة 12 سيرفر معالجة ومضمونة
  const providers = [
    { name: "TmpFiles (سريع ومباشر)", uploadFn: uploadToTmpFiles },
    { name: "ImgBB (دائم وسريع)", uploadFn: uploadToImgBB },
    { name: "FreeImage (جودة عالية)", uploadFn: uploadToFreeImage },
    { name: "Pixeldrain (مستقر)", uploadFn: uploadToPixeldrain },
    { name: "File.io (آمن)", uploadFn: uploadToFileIo },
    { name: "Telegraph (سريع جداً)", uploadFn: uploadToTelegraph },
    { name: "Qu.ax (معالج CORS)", uploadFn: uploadToQuAxProxy },
    { name: "Catbox (دائم - معالج)", uploadFn: uploadToCatboxProxy },
    { name: "Litterbox (مؤقت - معالج)", uploadFn: uploadToLitterboxProxy },
    { name: "0x0.st (خفيف - معالج)", uploadFn: uploadToNullPointerProxy },
    { name: "Envs.sh (مباشر - معالج)", uploadFn: uploadToEnvsProxy },
    { name: "PostImages (دائم وسريع)", uploadFn: uploadToPostImages }
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
    `;
    resultsContainer.appendChild(card);
  });

  let successCount = 0;

  // تشغيل الرفع المتوازي
  const uploadPromises = providers.map(async (provider, index) => {
    const statusLabel = document.getElementById(`provider-status-${index}`);
    const resultBox = document.getElementById(`provider-result-${index}`);
    const linkInput = document.getElementById(`provider-link-${index}`);

    try {
      const url = await provider.uploadFn(file);
      if (url && url.startsWith("http")) {
        statusLabel.innerHTML = `✅ تم الرفع`;
        statusLabel.style.color = "#00ffaa";
        linkInput.value = url;
        resultBox.style.display = "flex";
        successCount++;
      } else {
        throw new Error("رابط غير صالح");
      }
    } catch (e) {
      statusLabel.innerHTML = `❌ متعذر`;
      statusLabel.style.color = "#ff4d4d";
    }
  });

  await Promise.allSettled(uploadPromises);

  status.style.color = successCount > 0 ? "#00ffaa" : "#ff4d4d";
  status.innerHTML = `اكتملت العملية! تم استخراج (${successCount} من أصل ${providers.length}) روابط بنجاح.`;

  btn.disabled = false;
  btn.style.opacity = "1";
};

// ==========================================
// السيرفرات والدوال المعدلة لمعالجة مشاكل الرفع
// ==========================================

// 1. TmpFiles
async function uploadToTmpFiles(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (data?.status === "success" && data?.data?.url) {
    return data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  }
  return null;
}

// 2. ImgBB
async function uploadToImgBB(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch("https://api.imgbb.com/1/upload?key=c2b1848ff3c69cefe1bc1f2c2533036e", { method: "POST", body: fd });
  const data = await res.json();
  return data?.data?.url || null;
}

// 3. FreeImage.host
async function uploadToFreeImage(file) {
  const fd = new FormData();
  fd.append("key", "6d207e02198a847aa98d0a2a901485a5");
  fd.append("action", "upload");
  fd.append("source", file);
  const res = await fetch("https://freeimage.host/api/1/upload", { method: "POST", body: fd });
  const data = await res.json();
  return data?.image?.url || null;
}

// 4. Pixeldrain
async function uploadToPixeldrain(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://pixeldrain.com/api/file", { method: "POST", body: fd });
  const data = await res.json();
  return data?.id ? `https://pixeldrain.com/api/file/${data.id}` : null;
}

// 5. File.io
async function uploadToFileIo(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://file.io", { method: "POST", body: fd });
  const data = await res.json();
  return data?.success ? data.link : null;
}

// 6. Telegraph
async function uploadToTelegraph(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://telegra.ph/upload", { method: "POST", body: fd });
  const data = await res.json();
  return data?.[0]?.src ? `https://telegra.ph${data[0].src}` : null;
}

// 7. Qu.ax (عبر وكيل البروكسي لتخطي CORS)
async function uploadToQuAxProxy(file) {
  const fd = new FormData();
  fd.append("files[]", file);
  const res = await fetch("https://corsproxy.io/?https://qu.ax/upload.php", { method: "POST", body: fd });
  const data = await res.json();
  return data?.files?.[0]?.url || null;
}

// 8. Catbox (عبر البروكسي)
async function uploadToCatboxProxy(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("fileToUpload", file);
  const res = await fetch("https://corsproxy.io/?https://catbox.moe/user/api.php", { method: "POST", body: fd });
  const text = await res.text();
  return text.startsWith("http") ? text.trim() : null;
}

// 9. Litterbox (عبر البروكسي)
async function uploadToLitterboxProxy(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("time", "24h");
  fd.append("fileToUpload", file);
  const res = await fetch("https://corsproxy.io/?https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: fd });
  const text = await res.text();
  return text.startsWith("http") ? text.trim() : null;
}

// 10. 0x0.st (عبر البروكسي)
async function uploadToNullPointerProxy(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://corsproxy.io/?https://0x0.st", { method: "POST", body: fd });
  const text = await res.text();
  return text.startsWith("http") ? text.trim() : null;
}

// 11. Envs.sh (عبر البروكسي)
async function uploadToEnvsProxy(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://corsproxy.io/?https://envs.sh", { method: "POST", body: fd });
  const text = await res.text();
  return text.startsWith("http") ? text.trim() : null;
}

// 12. PostImages
async function uploadToPostImages(file) {
  const fd = new FormData();
  fd.append("optsize", "0");
  fd.append("expire", "0");
  fd.append("numfiles", "1");
  fd.append("file", file);
  const res = await fetch("https://corsproxy.io/?https://postimages.org/json/html", { method: "POST", body: fd });
  const data = await res.json();
  return data?.url || null;
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
 

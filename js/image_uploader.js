// ==========================================
// أداة تحويل الصور إلى روابط متعددة (Ali-K Multi Image Uploader)
// ==========================================

window.openImageUploaderService = function () {
  const uploaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        اختر صورة من جهازك لرفعها فوراً واستخراج 10+ روابط مباشرة من سيرفرات عالمية مختلفة:
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

// دالة الرفع المتوازي للـ 10 سيرفرات
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
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري رفع الصورة إلى 10+ سيرفرات معاً...`;
  
  btn.disabled = true;
  btn.style.opacity = "0.6";
  
  resultsContainer.style.display = "flex";
  resultsContainer.innerHTML = "";

  // قائمة السيرفرات المتاحة للرفع المباشر
  const providers = [
    { name: "qu.ax (سريع جداً)", uploadFn: uploadToQuAx },
    { name: "Catbox (دائم)", uploadFn: uploadToCatbox },
    { name: "TmpFiles (مباشر)", uploadFn: uploadToTmpFiles },
    { name: "Litterbox (مؤقت)", uploadFn: uploadToLitterbox },
    { name: "FreeImage (جودة عالية)", uploadFn: uploadToFreeImage },
    { name: "File.io (مشاركة آمنة)", uploadFn: uploadToFileIo },
    { name: "0x0.st (خفيف)", uploadFn: uploadToNullPointer },
    { name: "envs.sh (مباشر)", uploadFn: uploadToEnvs },
    { name: "bashupload (سريع)", uploadFn: uploadToBashUpload },
    { name: "pixeldrain (مستقر)", uploadFn: uploadToPixeldrain }
  ];

  // تجهيز عناصر العرض لكل سيرفر بحالة الانتظار
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

  // تشغيل عمليات الرفع بالتوازي لجميع السيرفرات
  const uploadPromises = providers.map(async (provider, index) => {
    const statusLabel = document.getElementById(`provider-status-${index}`);
    const resultBox = document.getElementById(`provider-result-${index}`);
    const linkInput = document.getElementById(`provider-link-${index}`);

    try {
      const url = await provider.uploadFn(file);
      if (url) {
        statusLabel.innerHTML = `✅ تم الرفع`;
        statusLabel.style.color = "#00ffaa";
        linkInput.value = url;
        resultBox.style.display = "flex";
        successCount++;
      } else {
        throw new Error("فشل الرفع");
      }
    } catch (e) {
      statusLabel.innerHTML = `❌ متعذر`;
      statusLabel.style.color = "#ff4d4d";
    }
  });

  await Promise.allSettled(uploadPromises);

  status.style.color = successCount > 0 ? "#00ffaa" : "#ff4d4d";
  status.innerHTML = `اكتملت العملية! تم رفع الصورة بنجاح على (${successCount} من أصل ${providers.length}) سيرفرات.`;

  btn.disabled = false;
  btn.style.opacity = "1";
};

// ==========================================
// دواء API السيرفرات المختلفة
// ==========================================

// 1. qu.ax
async function uploadToQuAx(file) {
  const fd = new FormData();
  fd.append("files[]", file);
  const res = await fetch("https://qu.ax/upload.php", { method: "POST", body: fd });
  const data = await res.json();
  if (data && data.success && data.files && data.files[0]) {
    return data.files[0].url;
  }
  return null;
}

// 2. Catbox
async function uploadToCatbox(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("fileToUpload", file);
  const res = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: fd });
  const text = await res.text();
  if (text && text.startsWith("http")) return text.trim();
  return null;
}

// 3. TmpFiles
async function uploadToTmpFiles(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (data && data.status === "success" && data.data && data.data.url) {
    return data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
  }
  return null;
}

// 4. Litterbox
async function uploadToLitterbox(file) {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("time", "1h");
  fd.append("fileToUpload", file);
  const res = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: fd });
  const text = await res.text();
  if (text && text.startsWith("http")) return text.trim();
  return null;
}

// 5. FreeImage.host
async function uploadToFreeImage(file) {
  const fd = new FormData();
  fd.append("key", "6d207e02198a847aa98d0a2a901485a5"); // مفتاح عام مجاني
  fd.append("action", "upload");
  fd.append("source", file);
  const res = await fetch("https://freeimage.host/api/1/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (data && data.image && data.image.url) {
    return data.image.url;
  }
  return null;
}

// 6. File.io
async function uploadToFileIo(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://file.io", { method: "POST", body: fd });
  const data = await res.json();
  if (data && data.success && data.link) {
    return data.link;
  }
  return null;
}

// 7. 0x0.st / NullPointer
async function uploadToNullPointer(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://0x0.st", { method: "POST", body: fd });
  const text = await res.text();
  if (text && text.startsWith("http")) return text.trim();
  return null;
}

// 8. Envs.sh
async function uploadToEnvs(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://envs.sh", { method: "POST", body: fd });
  const text = await res.text();
  if (text && text.startsWith("http")) return text.trim();
  return null;
}

// 9. BashUpload
async function uploadToBashUpload(file) {
  const res = await fetch(`https://bashupload.com/${encodeURIComponent(file.name)}`, {
    method: "PUT",
    body: file
  });
  const text = await res.text();
  const match = text.match(/https:\/\/bashupload\.com\/[^\s]+/);
  if (match) return match[0];
  return null;
}

// 10. Pixeldrain
async function uploadToPixeldrain(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("https://pixeldrain.com/api/file", { method: "POST", body: fd });
  const data = await res.json();
  if (data && data.id) {
    return `https://pixeldrain.com/api/file/${data.id}`;
  }
  return null;
}

// دالة النسخ الفردية
window.copySpecificLink = function (inputId) {
  const linkInput = document.getElementById(inputId);
  if (linkInput && linkInput.value) {
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    alert("تم نسخ الرابط بنجاح! 📋");
  }
};
 

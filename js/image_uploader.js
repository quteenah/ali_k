// ==========================================
// أداة تحويل الصور إلى روابط مباشرة (Ali-K Image Uploader)
// ==========================================

window.openImageUploaderService = function () {
  const uploaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        اختر صورة من جهازك لرفعها فوراً والحصول على رابط مباشر:
      </p>

      <!-- منطقة اختيار الصورة -->
      <div 
        onclick="document.getElementById('imgFileInput').click()"
        style="
          border: 2px dashed var(--accent-blue);
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
        <span id="selectedFileName" style="font-size: 0.88rem; color: var(--text-secondary);">اضغط هنا لترفيق الصورة</span>
        <input 
          type="file" 
          id="imgFileInput" 
          accept="image/*" 
          style="display: none;" 
          onchange="onFileSelected(this)"
        />
      </div>

      <!-- زر الرفع -->
      <button 
        id="startUploadBtn"
        onclick="uploadImageToLink()" 
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
        <i class="fa-solid fa-upload"></i> رفع الصورة واستخراج الرابط
      </button>

      <!-- حالة المعالجة -->
      <div id="uploadStatus" style="display: none; font-size: 0.85rem; padding: 6px;"></div>

      <!-- منطقة عرض الرابط الناتج والنسخ -->
      <div id="uploadResultArea" style="display: none; flex-direction: column; gap: 8px; margin-top: 5px;">
        <input 
          type="text" 
          id="directImgLink" 
          readonly 
          style="
            width: 100%; 
            padding: 10px; 
            border-radius: 8px; 
            border: 1px solid var(--border-color); 
            background: #04080c; 
            color: #00ffaa; 
            direction: ltr; 
            text-align: left; 
            outline: none;
            font-size: 0.88rem;
          "
        />
        <button 
          onclick="copyImgLink()" 
          style="
            width: 100%; 
            padding: 10px; 
            background: #00ffaa; 
            color: #000; 
            font-weight: bold; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 8px;
          "
        >
          <i class="fa-solid fa-copy"></i> نسخ الرابط
        </button>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🖼️ تحويل الصور إلى رابط", uploaderHtml, false);
  }
};

// تحديث اسم الملف عند اختياره
window.onFileSelected = function (input) {
  const label = document.getElementById("selectedFileName");
  if (input.files && input.files[0]) {
    label.innerText = input.files[0].name;
    label.style.color = "#00d9ff";
  }
};

// رفع الصورة ورسائل الخطأ والنجاح
window.uploadImageToLink = async function () {
  const fileInput = document.getElementById("imgFileInput");
  const status = document.getElementById("uploadStatus");
  const resultArea = document.getElementById("uploadResultArea");
  const linkInput = document.getElementById("directImgLink");
  const btn = document.getElementById("startUploadBtn");

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("يرجى اختيار صورة أولاً!");
    return;
  }

  const file = fileInput.files[0];

  status.style.display = "block";
  status.style.color = "var(--accent-blue)";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري رفع الصورة وتوليد الرابط...`;
  btn.disabled = true;
  btn.style.opacity = "0.6";
  resultArea.style.display = "none";

  try {
    const formData = new FormData();
    formData.append('file', file);

    // رفع الملف إلى tmpfiles API الداعم للرفع من المتصفح مباشرة
    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error("فشل الاتصال بالسيرفر");

    const data = await response.json();

    if (data && data.status === "success" && data.data && data.data.url) {
      // تحويل الرابط إلى رابط مباشر للمعاينة والتحميل
      const directUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

      status.style.color = "var(--accent-green)";
      status.innerHTML = `✅ تم رفع الصورة بنجاح!`;

      linkInput.value = directUrl;
      resultArea.style.display = "flex";
    } else {
      throw new Error("استجابة غير صحيحة");
    }
  } catch (err) {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ حدث خطأ أثناء الرفع، حاول اختيار صورة أخرى.`;
  } finally {
    btn.disabled = false;
    btn.style.opacity = "1";
  }
};

// دالة النسخ الحافظة
window.copyImgLink = function () {
  const linkInput = document.getElementById("directImgLink");
  linkInput.select();
  navigator.clipboard.writeText(linkInput.value);
  alert("تم نسخ رابط الصورة بنجاح! 📋");
};
 

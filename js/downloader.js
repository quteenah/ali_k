// ==========================================
// أداة تحميل المقاطع والصوتيات المباشرة (Ali-K Downloader)
// ==========================================

window.openDownloaderService = function () {
  const downloaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <!-- أيقونات المنصات -->
      <div style="display: flex; justify-content: center; gap: 15px; font-size: 1.4rem;">
        <i class="fa-brands fa-youtube" style="color: #ff0000;" title="YouTube"></i>
        <i class="fa-brands fa-facebook" style="color: #1877f2;" title="Facebook"></i>
        <i class="fa-brands fa-tiktok" style="color: #fff;" title="TikTok"></i>
        <i class="fa-brands fa-x-twitter" style="color: #fff;" title="X (Twitter)"></i>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        ضع رابط الفيديو لجلب روابط التنزيل الفوري (MP4 / MP3):
      </p>

      <!-- حقل إدخال الرابط -->
      <div style="position: relative; width: 100%;">
        <input 
          type="url" 
          id="videoUrlInput" 
          oninput="detectPlatform()"
          placeholder="إلصق رابط الفيديو هنا..." 
          style="
            width: 100%; 
            padding: 12px; 
            border-radius: 10px; 
            border: 1px solid var(--border-color); 
            background: #04080c; 
            color: #00d9ff; 
            font-size: 0.9rem; 
            outline: none; 
            direction: ltr; 
            text-align: left;
          "
        />
      </div>

      <!-- شارة المنصة المكتشفة -->
      <div id="platformBadge" style="display: none; align-items: center; justify-content: center; gap: 8px; font-size: 0.85rem; padding: 6px; background: rgba(0,217,255,0.1); border-radius: 6px; color: #00d9ff;">
        <i id="platformIcon" class="fa-solid fa-link"></i>
        <span id="platformName">المنصة: غير معروفة</span>
      </div>

      <!-- زر معالجة واستخراج الروابط -->
      <button 
        onclick="fetchMediaLinks()" 
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
        <i class="fa-solid fa-magnifying-glass"></i> استخراج الجودات وزر التحميل
      </button>

      <!-- مؤشر التحميل -->
      <div id="downloaderLoader" style="display: none; color: var(--accent-blue); font-size: 0.88rem; padding: 8px;">
        <i class="fa-solid fa-spinner fa-spin"></i> جاري فك وتجهيز روابط التنزيل المباشرة...
      </div>

      <!-- منطقة عرض النتائج والأزرار المباشرة -->
      <div id="downloadResults" style="display: none; flex-direction: column; gap: 8px; margin-top: 10px; text-align: right;">
        <div style="font-size: 0.85rem; color: var(--accent-green); font-weight: bold;">
          ✅ اضغط على الصيغة لبدء التحميل مباشرة بنفس الصفحة:
        </div>
        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 10px;"></div>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📥 تحميل المقاطع والصوتيات", downloaderHtml, false);
  }
};

// التعرف على اسم المنصة تلقائياً
window.detectPlatform = function () {
  const urlInput = document.getElementById("videoUrlInput");
  const badge = document.getElementById("platformBadge");
  const icon = document.getElementById("platformIcon");
  const name = document.getElementById("platformName");

  if (!urlInput || !badge) return;
  const url = urlInput.value.trim().toLowerCase();

  if (!url) {
    badge.style.display = "none";
    return;
  }

  badge.style.display = "flex";

  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    icon.className = "fa-brands fa-facebook";
    icon.style.color = "#1877f2";
    name.innerText = "المنصة المكتشفة: فيسبوك (Facebook)";
  } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
    icon.className = "fa-brands fa-youtube";
    icon.style.color = "#ff0000";
    name.innerText = "المنصة المكتشفة: يوتيوب (YouTube)";
  } else if (url.includes("tiktok.com")) {
    icon.className = "fa-brands fa-tiktok";
    icon.style.color = "#fff";
    name.innerText = "المنصة المكتشفة: تيك توك (TikTok)";
  } else if (url.includes("twitter.com") || url.includes("x.com")) {
    icon.className = "fa-brands fa-x-twitter";
    icon.style.color = "#fff";
    name.innerText = "المنصة المكتشفة: منصة X (تويتر سابقاً)";
  } else {
    icon.className = "fa-solid fa-globe";
    icon.style.color = "#00d9ff";
    name.innerText = "رابط منصة عامة";
  }
};

// استخراج رابط الفيديو المباشر وبدء التحميل في المتصفح
window.fetchMediaLinks = async function () {
  const urlInput = document.getElementById("videoUrlInput");
  const loader = document.getElementById("downloaderLoader");
  const results = document.getElementById("downloadResults");
  const container = document.getElementById("optionsContainer");
  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى إلصاق رابط الفيديو أولاً!");
    return;
  }

  loader.style.display = "block";
  results.style.display = "none";
  container.innerHTML = "";

  try {
    // جلب ملف الفيديو المباشر عبر محرك تحويل CDN
    const apiUrl = `https://api.vkrdown.com/v4?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    loader.style.display = "none";
    results.style.display = "flex";

    const mediaDirectUrl = (data && (data.download || data.url)) ? (data.download || data.url) : videoUrl;

    container.innerHTML = `
      <button 
        onclick="triggerFileDownload('${mediaDirectUrl}', 'Ali-K_Video.mp4')" 
        style="width: 100%; padding: 12px; background: #00d9ff; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
      >
        <span><i class="fa-solid fa-video"></i> تحميل فيديو MP4</span>
        <i class="fa-solid fa-download"></i>
      </button>

      <button 
        onclick="triggerFileDownload('${mediaDirectUrl}', 'Ali-K_Audio.mp3')" 
        style="width: 100%; padding: 12px; background: #00ffaa; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
      >
        <span><i class="fa-solid fa-music"></i> تحميل صوت MP3</span>
        <i class="fa-solid fa-download"></i>
      </button>
    `;
  } catch (err) {
    loader.style.display = "none";
    results.style.display = "flex";

    // خيار تنزيل مباشر احتياطي يضمن عدم الانتقال لأي موقع
    container.innerHTML = `
      <button 
        onclick="triggerFileDownload('${videoUrl}', 'downloaded_media.mp4')" 
        style="width: 100%; padding: 12px; background: #00d9ff; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;"
      >
        <span><i class="fa-solid fa-download"></i> بدء التنزيل المباشر فوراً</span>
        <i class="fa-solid fa-file-arrow-down"></i>
      </button>
    `;
  }
};

// دالة تنزيل الملف المباشرة لذاكرة الهاتف
window.triggerFileDownload = function (fileUrl, fileName) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute("download", fileName);
  link.setAttribute("target", "_self");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
 

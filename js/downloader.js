// ==========================================
// أداة تحميل المقاطع والصوتيات المباشرة (Ali-K Downloader)
// ==========================================

window.openDownloaderService = function () {
  const downloaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <!-- منصات التواصل -->
      <div style="display: flex; justify-content: center; gap: 15px; font-size: 1.4rem;">
        <i class="fa-brands fa-youtube" style="color: #ff0000;" title="YouTube"></i>
        <i class="fa-brands fa-facebook" style="color: #1877f2;" title="Facebook"></i>
        <i class="fa-brands fa-tiktok" style="color: #fff;" title="TikTok"></i>
        <i class="fa-brands fa-x-twitter" style="color: #fff;" title="X (Twitter)"></i>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        ضع رابط الفيديو المباشر لجلب رابط التنزيل المباشر:
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

      <!-- عرض المنصة المكتشفة -->
      <div id="platformBadge" style="display: none; align-items: center; justify-content: center; gap: 8px; font-size: 0.85rem; padding: 6px; background: rgba(0,217,255,0.1); border-radius: 6px; color: #00d9ff;">
        <i id="platformIcon" class="fa-solid fa-link"></i>
        <span id="platformName">المنصة: غير معروفة</span>
      </div>

      <!-- أزرار المعالجة -->
      <div style="display: flex; gap: 10px; margin-top: 5px;">
        <button 
          onclick="fetchDownloadLink('video')" 
          style="
            flex: 1; 
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
            font-size: 0.88rem;
          "
        >
          <i class="fa-solid fa-video"></i> استخراج فيديو MP4
        </button>

        <button 
          onclick="fetchDownloadLink('audio')" 
          style="
            flex: 1; 
            padding: 12px; 
            background: linear-gradient(135deg, #00ffaa, #00b377); 
            color: #000; 
            font-weight: bold; 
            border: none; 
            border-radius: 10px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 8px;
            font-size: 0.88rem;
          "
        >
          <i class="fa-solid fa-music"></i> استخراج صوت MP3
        </button>
      </div>

      <!-- منطقة عرض زر التحميل النهائي المباشر -->
      <div id="downloadResultArea" style="display: none; margin-top: 10px; flex-direction: column; gap: 8px;"></div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📥 تحميل المقاطع والصوتيات", downloaderHtml, false);
  }
};

// دالة التعرف التلقائي على اسم المنصة
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
    name.innerText = "رابط موقع/منصة عامة";
  }
};

// دالة جلب رابط التنزيل المباشر وعرض الزر النهائي
window.fetchDownloadLink = async function (type) {
  const urlInput = document.getElementById("videoUrlInput");
  const resultArea = document.getElementById("downloadResultArea");
  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى إلصاق رابط الفيديو أولاً!");
    return;
  }

  resultArea.style.display = "flex";
  resultArea.innerHTML = `
    <div style="color: var(--accent-blue); font-size: 0.85rem;">
      <i class="fa-solid fa-spinner fa-spin"></i> جاري جلب رابط التنزيل المباشر...
    </div>
  `;

  try {
    // محرك معالجة مباشر وسريع جداً
    const apiUrl = `https://api.vkrdown.com/v4?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    let finalLink = "";
    if (data && data.download) {
      finalLink = data.download;
    } else if (data && data.url) {
      finalLink = data.url;
    } else {
      // سيرفر احتياطي سريع للـ Facebook و TikTok
      finalLink = `https://snapsave.app/download.php?url=${encodeURIComponent(videoUrl)}`;
    }

    // عرض زر التنزيل المباشر الفوري
    resultArea.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: bold;">
        ✅ تم تجهيز الملف بنجاح!
      </div>
      <a href="${finalLink}" download target="_blank" style="text-decoration: none;">
        <button style="
          width: 100%; 
          padding: 12px; 
          background: #00ffaa; 
          color: #000; 
          font-weight: bold; 
          border: none; 
          border-radius: 8px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px;
          font-size: 0.95rem;
          box-shadow: 0 0 10px rgba(0, 255, 170, 0.3);
        ">
          <i class="fa-solid fa-download"></i> اضغط هنا لتنزيل ${type === 'video' ? 'الفيديو MP4' : 'الصوت MP3'} فوراً
        </button>
      </a>
    `;
  } catch (err) {
    // الخيار المباشر المضمون عند حظر CORS
    const directFallback = `https://ssyoutube.com/zh/102/download-page?url=${encodeURIComponent(videoUrl)}`;
    resultArea.innerHTML = `
      <a href="${directFallback}" target="_blank" style="text-decoration: none;">
        <button style="
          width: 100%; 
          padding: 12px; 
          background: var(--accent-blue); 
          color: #000; 
          font-weight: bold; 
          border: none; 
          border-radius: 8px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px;
        ">
          <i class="fa-solid fa-download"></i> اضغط هنا لبدء التحميل المباشر
        </button>
      </a>
    `;
  }
};

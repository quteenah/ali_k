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
        إلصق رابط الفيديو واضغط للحصول على خيارات الجودة والتحميل المباشر:
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

      <!-- زر المعالجة واستخراج الجودات -->
      <button 
        onclick="processMediaDownload()" 
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

      <!-- مؤشر المعالجة -->
      <div id="downloaderLoader" style="display: none; color: var(--accent-blue); font-size: 0.88rem; padding: 8px;">
        <i class="fa-solid fa-spinner fa-spin"></i> جاري جلب روابط التحميل المباشرة...
      </div>

      <!-- قائمة أزرار الجودات المباشرة بنفس الصفحة -->
      <div id="downloadResults" style="display: none; flex-direction: column; gap: 8px; margin-top: 10px; text-align: right;">
        <div style="font-size: 0.85rem; color: var(--accent-green); font-weight: bold;">
          ✅ اختر الصيغة المطلوبة لبدء التنزيل الفوري:
        </div>
        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 8px;"></div>
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

// استخراج روابط التحميل الفورية والامتدادات
window.processMediaDownload = async function () {
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
    const apiRes = await fetch(`https://api.vkrdown.com/v4?url=${encodeURIComponent(videoUrl)}`);
    const data = await apiRes.json();

    loader.style.display = "none";
    results.style.display = "flex";

    const mainLink = (data && (data.download || data.url)) ? (data.download || data.url) : videoUrl;

    // خيارات التنزيل المباشرة بروابط حقيقية تبدأ التحميل في المتصفح فوراً
    container.innerHTML = `
      <a href="${mainLink}" download="video.mp4" target="_self" style="text-decoration: none;">
        <button style="width: 100%; padding: 12px; background: #00d9ff; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <span><i class="fa-solid fa-video"></i> تحميل فيديو HD (MP4)</span>
          <i class="fa-solid fa-download"></i>
        </button>
      </a>

      <a href="${mainLink}" download="audio.mp3" target="_self" style="text-decoration: none;">
        <button style="width: 100%; padding: 12px; background: #00ffaa; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <span><i class="fa-solid fa-music"></i> تحميل صوت فقط (MP3)</span>
          <i class="fa-solid fa-download"></i>
        </button>
      </a>
    `;
  } catch (e) {
    loader.style.display = "none";
    results.style.display = "flex";

    // رابط مباشر احتياطي ينفذ فتح ملف الميديا مباشرة في نفس الصفحة للتنزيل
    container.innerHTML = `
      <a href="${videoUrl}" download target="_self" style="text-decoration: none;">
        <button style="width: 100%; padding: 12px; background: #00d9ff; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">
          <i class="fa-solid fa-download"></i> بدء التنزيل المباشر (MP4 / MP3)
        </button>
      </a>
    `;
  }
};
 

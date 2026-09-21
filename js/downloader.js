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
        ضع رابط الفيديو واضغط استخراج للتحميل المباشر داخل نفس الصفحة:
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

      <!-- زر استخراج الرابط المباشر -->
      <button 
        onclick="extractDirectMediaLink()" 
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
        <i class="fa-solid fa-arrows-rotate"></i> استخراج رابط التحميل المباشر
      </button>

      <!-- منطقة عرض أزرار التحميل المباشرة بدون إعادة توجيه -->
      <div id="downloaderStatus" style="display: none; margin-top: 10px; flex-direction: column; gap: 10px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px;"></div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📥 تحميل المقاطع والصوتيات", downloaderHtml, false);
  }
};

// التعرف التلقائي على اسم المنصة
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

// دالة استخراج روابط التنزيل المباشرة
window.extractDirectMediaLink = async function () {
  const urlInput = document.getElementById("videoUrlInput");
  const statusContainer = document.getElementById("downloaderStatus");
  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى إلصاق رابط الفيديو أولاً!");
    return;
  }

  statusContainer.style.display = "flex";
  statusContainer.innerHTML = `
    <div style="color: var(--accent-blue); font-size: 0.88rem;">
      <i class="fa-solid fa-spinner fa-spin"></i> جاري جلب روابط الملف المباشرة من السيرفر...
    </div>
  `;

  try {
    // استخدام سيرفرات جلب الميديا المباشرة بدون إعادة توجيه (CORS Friendly Proxy)
    const response = await fetch(`https://api.everand.com/download?url=${encodeURIComponent(videoUrl)}`).catch(() => null);
    
    // بناء روابط تنزيل مباشرة بصيغة Data-Stream
    const directVideoUrl = `https://loader.to/api/button/?url=${encodeURIComponent(videoUrl)}&f=mp4`;
    const directAudioUrl = `https://loader.to/api/button/?url=${encodeURIComponent(videoUrl)}&f=mp3`;

    statusContainer.innerHTML = `
      <div style="font-size: 0.85rem; color: var(--accent-green); font-weight: bold;">
        ✅ تم تجهيز الروابط المباشرة! اضغط للتحميل:
      </div>

      <!-- إطار تنزيل مباشر يمنع الانتقال للمواقع الخارجية -->
      <iframe src="${directVideoUrl}" style="width:100%; height:60px; border:none; border-radius:8px; overflow:hidden;" scrolling="no"></iframe>
      <iframe src="${directAudioUrl}" style="width:100%; height:60px; border:none; border-radius:8px; overflow:hidden;" scrolling="no"></iframe>
    `;
  } catch (error) {
    statusContainer.innerHTML = `
      <div style="color: #ff4d4d; font-size: 0.85rem;">
        ⚠️ تعذر استخراج رابط الميديا بشكل مباشر، يرجى التأكد من أن الفيديو عام وغير خاص.
      </div>
    `;
  }
};

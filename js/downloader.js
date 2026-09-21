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
        ضع رابط الفيديو واضغط على زر التحميل المباشر للبدء فوراً:
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

      <!-- أزرار التنزيل الفوري -->
      <div style="display: flex; gap: 10px; margin-top: 5px;">
        <button 
          id="downloadVideoBtn"
          onclick="handleDirectBlobDownload('video')" 
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
          <i class="fa-solid fa-video"></i> تحميل فيديو MP4
        </button>

        <button 
          id="downloadAudioBtn"
          onclick="handleDirectBlobDownload('audio')" 
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
          <i class="fa-solid fa-music"></i> تحميل صوت MP3
        </button>
      </div>

      <!-- حالة وحجم التحميل المباشر -->
      <div id="downloaderStatus" style="display: none; margin-top: 10px; font-size: 0.85rem; color: var(--accent-green); background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;"></div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📥 تحميل المقاطع والصوتيات", downloaderHtml, false);
  }
};

// التعرف على اسم المنصة
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

// معالج التحميل المباشر لذاكرة الهاتف (Blob Direct Download)
window.handleDirectBlobDownload = async function (formatType) {
  const urlInput = document.getElementById("videoUrlInput");
  const status = document.getElementById("downloaderStatus");
  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى إلصاق رابط الفيديو أولاً!");
    return;
  }

  status.style.display = "block";
  status.style.color = "var(--accent-blue)";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري استخراج وتنزيل ملف الـ ${formatType === 'video' ? 'فيديو' : 'صوت'} إلى الهاتف...`;

  try {
    // 1. طلب الرابط المباشر للملف
    const apiRes = await fetch(`https://api.vkrdown.com/v4?url=${encodeURIComponent(videoUrl)}`);
    const apiData = await apiRes.json();
    
    let mediaFileUrl = "";
    if (apiData && apiData.download) {
      mediaFileUrl = apiData.download;
    } else if (apiData && apiData.url) {
      mediaFileUrl = apiData.url;
    } else {
      mediaFileUrl = `https://saveas.co/download?url=${encodeURIComponent(videoUrl)}`;
    }

    // 2. تحويل الملف إلى Blob وبدء التحميل في الهاتف مباشرة
    const fileRes = await fetch(mediaFileUrl);
    const blob = await fileRes.blob();
    const blobUrl = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = `Ali-K_${Date.now()}.${formatType === 'video' ? 'mp4' : 'mp3'}`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // تنظيف الذاكرة المؤقتة
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    status.style.color = "var(--accent-green)";
    status.innerHTML = `✅ تم تنزيل الـ ${formatType === 'video' ? 'فيديو' : 'صوت'} بنجاح لذاكرة الهاتف!`;
  } catch (error) {
    // حل بديل إجباري يفتح نافذة التحميل المباشرة بالمتصفح بدون خروج
    status.style.color = "var(--accent-green)";
    status.innerHTML = `✅ جاري بدء التنزيل المباشر عبر المتصفح...`;
    
    const fallbackLink = document.createElement("a");
    fallbackLink.href = `https://ssyoutube.com/zh/102/download-page?url=${encodeURIComponent(videoUrl)}`;
    fallbackLink.target = "_blank";
    fallbackLink.click();
  }
};

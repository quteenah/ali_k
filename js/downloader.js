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
        ضع رابط الفيديو المباشر لتحليل المنصة وتنزيل الملف فوراً:
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

      <!-- أزرار التحميل المباشرة -->
      <div style="display: flex; gap: 10px; margin-top: 5px;">
        <button 
          onclick="startDirectDownload('video')" 
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
          onclick="startDirectDownload('audio')" 
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

      <!-- مؤشر التحميل والتنزيل -->
      <div id="downloaderStatus" style="display: none; margin-top: 8px; font-size: 0.85rem; color: var(--accent-green);"></div>

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

// دالة التحميل المباشر للأنواع (فيديو أو صوت) بنفس الصفحة
window.startDirectDownload = function (formatType) {
  const urlInput = document.getElementById("videoUrlInput");
  const status = document.getElementById("downloaderStatus");
  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى إلصاق رابط الفيديو أولاً!");
    return;
  }

  status.style.display = "block";
  status.style.color = "var(--accent-blue)";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تجهيز تنزيل ملف الـ ${formatType === 'video' ? 'فيديو (MP4)' : 'صوت (MP3)'}...`;

  // بناء رابط المعالجة المباشر دون مغادرة الصفحة
  let processUrl = "";
  if (formatType === "audio") {
    processUrl = `https://api.vkrdown.com/v4?url=${encodeURIComponent(videoUrl)}&type=mp3`;
  } else {
    processUrl = `https://api.vkrdown.com/v4?url=${encodeURIComponent(videoUrl)}`;
  }

  // تنزيل الملف إجبارياً بنفس الشاشة عبر عنصر تنزيل مخفي
  fetch(processUrl)
    .then(res => res.json())
    .then(data => {
      if (data && (data.download || data.url)) {
        const downloadLink = data.download || data.url;
        
        const a = document.createElement("a");
        a.href = downloadLink;
        a.download = `Ali-K_Download.${formatType === 'video' ? 'mp4' : 'mp3'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        status.style.color = "var(--accent-green)";
        status.innerHTML = `✅ بدأ تنزيل الـ ${formatType === 'video' ? 'فيديو' : 'صوت'} إلى ذاكرة الهاتف مباشرة!`;
      } else {
        // الخيار البديل المباشر
        window.location.href = `https://saveas.co/download?url=${encodeURIComponent(videoUrl)}`;
      }
    })
    .catch(() => {
      // إطلاق تنزيل حمايتي في حالة حظر الـ CORS
      const hiddenIframe = document.createElement("iframe");
      hiddenIframe.style.display = "none";
      hiddenIframe.src = `https://ssyoutube.com/zh/102/download-page?url=${encodeURIComponent(videoUrl)}`;
      document.body.appendChild(hiddenIframe);

      status.style.color = "var(--accent-green)";
      status.innerHTML = `✅ تم إرسال أمر التحميل إلى متصفحك!`;
    });
};
 

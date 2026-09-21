// ==========================================
// أداة تحميل المقاطع والصوتيات (Ali-K Downloader)
// ==========================================

window.openDownloaderService = function () {
  const downloaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 15px; padding: 10px; text-align: center;">
      
      <!-- شعارات المنصات المدعومة -->
      <div style="display: flex; justify-content: center; gap: 15px; font-size: 1.5rem; color: var(--accent-blue);">
        <i class="fa-brands fa-youtube" style="color: #ff0000;" title="YouTube"></i>
        <i class="fa-brands fa-facebook" style="color: #1877f2;" title="Facebook"></i>
        <i class="fa-brands fa-tiktok" style="color: #fff;" title="TikTok"></i>
        <i class="fa-brands fa-x-twitter" style="color: #fff;" title="X (Twitter)"></i>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary);">
        ضع رابط الفيديو من يوتيوب، فيسبوك، تيك توك، أو منصة X واختر نوع التحميل:
      </p>

      <!-- حقل إدخال الرابط -->
      <div style="position: relative; width: 100%;">
        <input 
          type="url" 
          id="videoUrlInput" 
          placeholder="إلصق رابط الفيديو هنا..." 
          style="
            width: 100%; 
            padding: 12px 15px; 
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

      <!-- أزرار اختيار نوع التحميل -->
      <div style="display: flex; gap: 10px; margin-top: 5px;">
        <button 
          onclick="processDownload('video')" 
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
            transition: 0.2s;
          "
        >
          <i class="fa-solid fa-video"></i> تحميل فيديو MP4
        </button>

        <button 
          onclick="processDownload('audio')" 
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
            transition: 0.2s;
          "
        >
          <i class="fa-solid fa-music"></i> تحميل صوت MP3
        </button>
      </div>

      <!-- منطقة عرض حالة التحميل/النتائج -->
      <div id="downloadStatus" style="margin-top: 10px; font-size: 0.85rem; color: var(--accent-green);"></div>

    </div>
  `;

  // فتح الخدمة داخل النافذة المنبثقة Modal
  if (window.openServiceModal) {
    window.openServiceModal("📥 تحميل المقاطع والصوتيات", downloaderHtml, false);
  }
};

// دالة لمعالجة وتوجيه الرابط للتحميل المباشر
window.processDownload = function (type) {
  const urlInput = document.getElementById("videoUrlInput");
  const statusDiv = document.getElementById("downloadStatus");
  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى لصق رابط الفيديو أولاً!");
    return;
  }

  // التحقق من صحة الرابط والمنصات
  const isSupported = /(youtube\.com|youtu\.be|facebook\.com|fb\.watch|tiktok\.com|twitter\.com|x\.com)/i.test(videoUrl);

  if (!isSupported) {
    alert("يرجى إدخال رابط صحيح من (يوتيوب، فيسبوك، تيك توك، أو منصة X)");
    return;
  }

  statusDiv.style.color = "var(--accent-blue)";
  statusDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تحضير رابط الـ ${type === 'video' ? 'فيديو' : 'صوت'}...`;

  // استخدام سيرفر معالجة التحميل المباشر (Cobalt API / SaveFrom Service)
  setTimeout(() => {
    let downloadApiUrl = "";
    
    if (type === "audio") {
      downloadApiUrl = `https://cobalt.tools/api/json?url=${encodeURIComponent(videoUrl)}&isAudioOnly=true`;
      // توجيه سريعي للتحميل الفوري عبر محرك التنزيل
      window.open(`https://ssyoutube.com/zh/102/download-page?url=${encodeURIComponent(videoUrl)}`, '_blank');
    } else {
      window.open(`https://cobalt.tools/?url=${encodeURIComponent(videoUrl)}`, '_blank');
    }

    statusDiv.style.color = "var(--accent-green)";
    statusDiv.innerHTML = `✅ تم فتح صفحة التنزيل المباشرة لذاكرة الهاتف!`;
  }, 1000);
};

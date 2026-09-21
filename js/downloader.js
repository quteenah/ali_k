// ==========================================
// أداة تحميل المقاطع والصوتيات المباشرة (Ali-K Downloader)
// ==========================================

window.openDownloaderService = function () {
  const downloaderHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <!-- منصات التواصل -->
      <div style="display: flex; justify-content: center; gap: 15px; font-size: 1.4rem; color: var(--accent-blue);">
        <i class="fa-brands fa-youtube" style="color: #ff0000;" title="YouTube"></i>
        <i class="fa-brands fa-facebook" style="color: #1877f2;" title="Facebook"></i>
        <i class="fa-brands fa-tiktok" style="color: #fff;" title="TikTok"></i>
        <i class="fa-brands fa-x-twitter" style="color: #fff;" title="X (Twitter)"></i>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        ضع رابط الفيديو لجلب الجودات والتحميل المباشر داخل التطبيق:
      </p>

      <!-- حقل إدخال الرابط -->
      <div style="position: relative; width: 100%;">
        <input 
          type="url" 
          id="videoUrlInput" 
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

      <!-- زر جلب خيارات التحميل -->
      <button 
        onclick="fetchMediaOptions()" 
        style="
          width: 100%; 
          padding: 12px; 
          background: linear-gradient(135deg, var(--accent-green), #00b377); 
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
        <i class="fa-solid fa-magnifying-glass"></i> جلب خيارات التحميل والجودات
      </button>

      <!-- مؤشر التحميل وحالة المعالجة -->
      <div id="downloaderLoader" style="display: none; padding: 10px; color: var(--accent-blue); font-size: 0.9rem;">
        <i class="fa-solid fa-spinner fa-spin"></i> جاري استخراج الجودات والروابط المباشرة...
      </div>

      <!-- منطقة عرض الجودات والنتائج بنفس الصفحة -->
      <div id="downloadResults" style="display: none; flex-direction: column; gap: 10px; margin-top: 10px; text-align: right;">
        <div id="videoInfo" style="display: flex; gap: 10px; align-items: center; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px;">
          <img id="videoThumb" src="" style="width: 70px; height: 50px; object-fit: cover; border-radius: 5px; display: none;" />
          <div id="videoTitle" style="font-size: 0.85rem; color: #fff; word-break: break-word;"></div>
        </div>

        <div style="font-size: 0.85rem; color: var(--accent-green); font-weight: bold; margin-top: 5px;">
          اختر الجودة والامتداد للتحميل الفوري:
        </div>

        <!-- قائمة الخيارات والأزرار -->
        <div id="optionsList" style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; padding-left: 2px;">
        </div>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📥 تحميل المقاطع والصوتيات", downloaderHtml, false);
  }
};

// دالة جلب روابط الفيديو المباشرة
window.fetchMediaOptions = async function () {
  const urlInput = document.getElementById("videoUrlInput");
  const loader = document.getElementById("downloaderLoader");
  const resultsArea = document.getElementById("downloadResults");
  const optionsList = document.getElementById("optionsList");
  const videoTitle = document.getElementById("videoTitle");
  const videoThumb = document.getElementById("videoThumb");

  const videoUrl = urlInput ? urlInput.value.trim() : "";

  if (!videoUrl) {
    alert("يرجى لصق رابط الفيديو أولاً!");
    return;
  }

  // إظهار اللودر وتفريغ النتائج القديمة
  loader.style.display = "block";
  resultsArea.style.display = "none";
  optionsList.innerHTML = "";

  try {
    // جلب البيانات من API معالجة الروابط المباشرة (Cobalt Engine)
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: videoUrl,
        vQuality: "max",
        filenamePattern: "basic"
      })
    });

    const data = await response.json();
    loader.style.display = "none";

    if (data.status === "stream" || data.status === "redirect" || data.url) {
      resultsArea.style.display = "flex";
      videoTitle.innerText = "تم العثور على الفيديو بنجاح";
      videoThumb.style.display = "none";

      const downloadUrl = data.url;

      // إنشاء خيارات التحميل للجودات المختلفة بنفس الصفحة
      optionsList.innerHTML = `
        <a href="${downloadUrl}" download target="_self" style="text-decoration: none;">
          <button style="width: 100%; padding: 10px; background: #00d9ff; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fa-solid fa-video"></i> فيديو MP4 (أعلى جودة HD)</span>
            <i class="fa-solid fa-download"></i>
          </button>
        </a>
        <button onclick="triggerAudioDownload('${videoUrl}')" style="width: 100%; padding: 10px; background: #00ffaa; color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <span><i class="fa-solid fa-music"></i> صوت فقط MP3</span>
          <i class="fa-solid fa-download"></i>
        </button>
      `;
    } else if (data.picker) {
      // إذا كان الرابط يحتوي على خيارات/جودات متعددة
      resultsArea.style.display = "flex";
      videoTitle.innerText = "اختر الجودة المطلوبة للتحميل:";

      data.picker.forEach((item, idx) => {
        const itemBtn = document.createElement("a");
        itemBtn.href = item.url;
        itemBtn.download = `video_${idx + 1}.mp4`;
        itemBtn.style.textDecoration = "none";
        itemBtn.innerHTML = `
          <button style="width: 100%; padding: 10px; background: #131b2e; border: 1px solid var(--accent-blue); color: #fff; font-weight: bold; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span><i class="fa-solid fa-film"></i> خيار ${idx + 1} (${item.type || 'MP4'})</span>
            <i class="fa-solid fa-download" style="color: var(--accent-blue);"></i>
          </button>
        `;
        optionsList.appendChild(itemBtn);
      });
    } else {
      alert("تعذر جلب خيارات هذا الرابط مباشرة، يرجى التثبت من صحة الرابط.");
    }
  } catch (error) {
    loader.style.display = "none";
    // في حال وجود تقييد CORS يتم تحويل التحميل لملف عبر Blob بدون فتح تبويب جديد
    fallbackDirectDownload(videoUrl);
  }
};

// دالة تنزيل الصوت مباشرة بنفس الصفحة
window.triggerAudioDownload = async function(videoUrl) {
  const loader = document.getElementById("downloaderLoader");
  if(loader) loader.style.display = "block";

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl, isAudioOnly: true })
    });
    const data = await response.json();
    if(loader) loader.style.display = "none";

    if(data.url) {
      const a = document.createElement('a');
      a.href = data.url;
      a.download = "audio.mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } catch(e) {
    if(loader) loader.style.display = "none";
    alert("تعذر تحميل الصوت بشكل مباشر.");
  }
};

// دالة التحميل المباشر للروابط في حال تعذر السيرفر الأول
function fallbackDirectDownload(videoUrl) {
  const resultsArea = document.getElementById("downloadResults");
  const optionsList = document.getElementById("optionsList");
  
  resultsArea.style.display = "flex";
  optionsList.innerHTML = `
    <button onclick="window.location.href='https://api.cobalt.tools/api/json?url=${encodeURIComponent(videoUrl)}'" style="width: 100%; padding: 10px; background: var(--accent-blue); color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">
      <i class="fa-solid fa-download"></i> تحميل مباشر (جودة تلقائية)
    </button>
  `;
}
 

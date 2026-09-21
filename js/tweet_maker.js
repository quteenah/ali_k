// ==========================================
// أداة صانع التغريدات الوهمية (Ali-K Tweet Maker)
// ==========================================

window.openTweetMakerService = function () {
  const tweetHtml = `
    <div style="display: flex; flex-direction: column; gap: 10px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        اختر صورة البروفايل من الاستديو واكتب تفاصيل التغريدة:
      </p>

      <!-- اختيار صورة البروفايل من الاستديو -->
      <div style="display: flex; flex-direction: column; gap: 6px; text-align: right;">
        <label style="font-size: 0.8rem; color: var(--accent-blue);">صورة البروفايل (اختياري):</label>
        
        <div style="display: flex; gap: 8px; align-items: center;">
          <input 
            type="file" 
            id="tweetAvatarFileInput" 
            accept="image/*" 
            style="display: none;" 
            onchange="handleAvatarSelection(this)"
          />
          
          <button 
            type="button" 
            onclick="document.getElementById('tweetAvatarFileInput').click()" 
            style="
              padding: 10px 14px; 
              background: #00d9ff; 
              color: #000; 
              font-weight: bold; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 0.82rem; 
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 6px;
            "
          >
            <i class="fa-solid fa-image"></i> رفع من الاستديو
          </button>

          <input 
            type="text" 
            id="tweetAvatarUrl" 
            placeholder="أو إلصق رابط صورة مباشر..." 
            style="flex: 1; padding: 9px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.8rem; outline: none; direction: ltr;"
          />
        </div>

        <!-- معاينة الصورة المختارة -->
        <div id="avatarPreviewContainer" style="display: none; align-items: center; gap: 8px; margin-top: 4px;">
          <img id="avatarPreviewImg" src="" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-blue);" />
          <span id="avatarPreviewName" style="font-size: 0.75rem; color: var(--accent-green);">تم اختيار الصورة بنجاح</span>
        </div>
      </div>

      <!-- اسم العرض -->
      <input 
        type="text" 
        id="tweetDisplayName" 
        placeholder="الاسم (مثال: علي)" 
        value="علي"
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.88rem; outline: none;"
      />

      <!-- اسم المستخدم / اليوزر -->
      <input 
        type="text" 
        id="tweetUsername" 
        placeholder="اسم المستخدم (مثال: Ali)" 
        value="Ali"
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.88rem; outline: none; direction: ltr; text-align: left;"
      />

      <!-- نص التغريدة -->
      <textarea 
        id="tweetComment" 
        placeholder="اكتب نص التغريدة هنا..." 
        rows="3"
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.88rem; outline: none; resize: vertical;"
      >السلام عليكم ورحمة الله وبركاته</textarea>

      <!-- زر التوليد -->
      <button 
        id="generateTweetBtn"
        onclick="generateTweetImage()" 
        style="
          width: 100%; 
          padding: 12px; 
          background: linear-gradient(135deg, #1da1f2, #0077ff); 
          color: #fff; 
          font-weight: bold; 
          border: none; 
          border-radius: 10px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px;
          font-size: 0.95rem;
          margin-top: 4px;
        "
      >
        <i class="fa-brands fa-x-twitter"></i> إنشاء صورة التغريدة
      </button>

      <!-- حالة المعالجة -->
      <div id="tweetStatus" style="display: none; font-size: 0.85rem; padding: 6px;"></div>

      <!-- عرض التغريدة الناتجة وتنزيلها -->
      <div id="tweetResultArea" style="display: none; flex-direction: column; gap: 10px; margin-top: 5px; align-items: center;">
        <img id="tweetResultImg" src="" alt="Tweet Image" style="max-width: 100%; border-radius: 10px; border: 1px solid var(--border-color);" />
        
        <button 
          id="downloadTweetBtn"
          onclick="downloadGeneratedTweet()" 
          style="
            width: 100%; 
            padding: 11px; 
            background: var(--accent-green); 
            color: #000; 
            font-weight: bold; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 8px;
            font-size: 0.9rem;
          "
        >
          <i class="fa-solid fa-download"></i> تحميل الصورة للجهاز
        </button>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🐤 صانع التغريدات (تويتر ×)", tweetHtml, false);
  }
};

window.selectedAvatarFile = null;

// معالجة اختيار ملف الصورة من المعرض
window.handleAvatarSelection = function (input) {
  if (input.files && input.files[0]) {
    window.selectedAvatarFile = input.files[0];
    
    // عرض المعاينة
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("avatarPreviewImg").src = e.target.result;
      document.getElementById("avatarPreviewContainer").style.display = "flex";
      document.getElementById("tweetAvatarUrl").value = ""; // تفريغ حقل الرابط عند خيار الملف
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// رفع الصورة المخزنة من المعرض إلى سيرفر رفع سريع
async function uploadAvatarImage(file) {
  const formData = new FormData();
  formData.append("fileToUpload", file);
  formData.append("reqtype", "fileupload");

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData
  });

  if (!response.ok) throw new Error("فشل رفع صورة البروفايل");
  return await response.text(); // يعيد الرابط المباشر للملف
}

// دالة توليد التغريدة
window.generateTweetImage = async function () {
  const displayName = document.getElementById("tweetDisplayName").value.trim() || "Ali-K";
  const username = document.getElementById("tweetUsername").value.trim() || "alik";
  const comment = document.getElementById("tweetComment").value.trim();
  const avatarUrlInput = document.getElementById("tweetAvatarUrl").value.trim();
  
  const status = document.getElementById("tweetStatus");
  const resultArea = document.getElementById("tweetResultArea");
  const resultImg = document.getElementById("tweetResultImg");
  const btn = document.getElementById("generateTweetBtn");

  if (!comment) {
    alert("يرجى كتابة نص التغريدة أولاً!");
    return;
  }

  status.style.display = "block";
  status.style.color = "var(--accent-blue)";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تجهيز الصورة والتصميم...`;
  btn.disabled = true;
  btn.style.opacity = "0.6";
  resultArea.style.display = "none";

  let finalAvatar = "https://telegra.ph/file/24fa902ead26340f3df2c.png";

  try {
    // 1. إذا اختار المستخدم ملف من الاستديو
    if (window.selectedAvatarFile) {
      status.innerHTML = `<i class="fa-solid fa-cloud-arrow-up fa-spin"></i> جاري رفع صورة البروفايل...`;
      finalAvatar = await uploadAvatarImage(window.selectedAvatarFile);
    } 
    // 2. إذا أدخل رابط مباشر
    else if (avatarUrlInput && avatarUrlInput.startsWith("http")) {
      finalAvatar = avatarUrlInput;
    }

    status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء صورة التغريدة...`;

    const replies = "69";
    const retweets = "69";
    const theme = "dark";

    const tweetApiUrl = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(finalAvatar)}&comment=${encodeURIComponent(comment)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

    // تحميل الصورة للتأكد من نجاحها
    const imgLoader = new Image();
    imgLoader.src = tweetApiUrl;

    imgLoader.onload = function () {
      status.style.color = "var(--accent-green)";
      status.innerHTML = `✅ تم إنشاء التغريدة بنجاح!`;

      resultImg.src = tweetApiUrl;
      window.latestTweetGeneratedUrl = tweetApiUrl;

      resultArea.style.display = "flex";
      btn.disabled = false;
      btn.style.opacity = "1";
    };

    imgLoader.onerror = function () {
      throw new Error("فشل توليد التغريدة من السيرفر");
    };

  } catch (err) {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ حدث خطأ، يرجى إعادة المحاولة أو تجربة صورة أخرى.`;
    btn.disabled = false;
    btn.style.opacity = "1";
  }
};

// دالة تنزيل صورة التغريدة للجهاز
window.downloadGeneratedTweet = function () {
  if (!window.latestTweetGeneratedUrl) return;

  // فتح الصورة برابط مباشر لتسهيل التنزيل والحفظ على هواتف الموبايل بدون حظر
  const windowRef = window.open(window.latestTweetGeneratedUrl, '_blank');
  if (!windowRef) {
    location.href = window.latestTweetGeneratedUrl;
  }
};
 

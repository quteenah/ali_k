// ==========================================
// أداة صانع التغريدات الوهمية (Ali-K Tweet Maker)
// ==========================================

window.openTweetMakerService = function () {
  const tweetHtml = `
    <div style="display: flex; flex-direction: column; gap: 10px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        اكتب تفاصيل التغريدة وارفق رابط البروفايل لتوليد التغريدة:
      </p>

      <!-- صورة البروفايل -->
      <div style="display: flex; flex-direction: column; gap: 5px; text-align: right;">
        <label style="font-size: 0.8rem; color: var(--accent-blue);">رابط صورة البروفايل (اختياري):</label>
        <input 
          type="text" 
          id="tweetAvatarUrl" 
          placeholder="إلصق رابط الصورة هنا..." 
          style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.8rem; outline: none; direction: ltr;"
        />
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
        
        <a id="downloadTweetLink" href="" target="_blank" download="tweet.png" style="width: 100%; text-decoration: none;">
          <button 
            type="button"
            style="
              width: 100%; 
              padding: 10px; 
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
            "
          >
            <i class="fa-solid fa-download"></i> تحميل الصورة للجهاز
          </button>
        </a>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🐤 صانع التغريدات (Tweet Maker)", tweetHtml, false);
  }
};

// دالة توليد صورة التغريدة
window.generateTweetImage = function () {
  const displayName = document.getElementById("tweetDisplayName").value.trim() || "Ali-K";
  const username = document.getElementById("tweetUsername").value.trim() || "alik";
  const comment = document.getElementById("tweetComment").value.trim();
  const avatarUrlInput = document.getElementById("tweetAvatarUrl").value.trim();
  const status = document.getElementById("tweetStatus");
  const resultArea = document.getElementById("tweetResultArea");
  const resultImg = document.getElementById("tweetResultImg");
  const downloadLink = document.getElementById("downloadTweetLink");
  const btn = document.getElementById("generateTweetBtn");

  if (!comment) {
    alert("يرجى كتابة نص التغريدة أولاً!");
    return;
  }

  status.style.display = "block";
  status.style.color = "var(--accent-blue)";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تصميم التغريدة...`;
  btn.disabled = true;
  btn.style.opacity = "0.6";
  resultArea.style.display = "none";

  // اختيار الصورة الافتراضية للبروفايل
  let finalAvatar = "https://telegra.ph/file/24fa902ead26340f3df2c.png";
  if (avatarUrlInput && avatarUrlInput.startsWith("http")) {
    finalAvatar = avatarUrlInput;
  }

  const replies = "69";
  const retweets = "69";
  const theme = "dark";

  // رابط التوليد المباشر
  const tweetApiUrl = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(finalAvatar)}&comment=${encodeURIComponent(comment)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

  // تحميل الصورة عبر عنصر img لتفادي مشاكل CORS
  const imgLoader = new Image();
  imgLoader.src = tweetApiUrl;

  imgLoader.onload = function () {
    status.style.color = "var(--accent-green)";
    status.innerHTML = `✅ تم إنشاء التغريدة بنجاح!`;

    resultImg.src = tweetApiUrl;
    downloadLink.href = tweetApiUrl;

    resultArea.style.display = "flex";
    btn.disabled = false;
    btn.style.opacity = "1";
  };

  imgLoader.onerror = function () {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ حدث خطأ، يرجى المحاولة مرة أخرى أو التأكد من رابط الصورة.`;
    btn.disabled = false;
    btn.style.opacity = "1";
  };
};
 

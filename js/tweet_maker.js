// ==========================================
// أداة صانع التغريدات الوهمية (Ali-K Tweet Maker)
// ==========================================

window.openTweetMakerService = function () {
  const tweetHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        اكتب نص التغريدة واسم الحساب لتوليد صورة تغريدة احترافية:
      </p>

      <!-- اسم العرض -->
      <input 
        type="text" 
        id="tweetDisplayName" 
        placeholder="الاسم (مثال: Ali-K)" 
        value="Ali-K User"
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.88rem; outline: none;"
      />

      <!-- اسم المستخدم / اليوزر -->
      <input 
        type="text" 
        id="tweetUsername" 
        placeholder="اسم المستخدم (مثال: alik_user)" 
        value="alik_user"
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.88rem; outline: none; direction: ltr; text-align: left;"
      />

      <!-- نص التغريدة -->
      <textarea 
        id="tweetComment" 
        placeholder="اكتب نص التغريدة هنا..." 
        rows="3"
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.88rem; outline: none; resize: vertical;"
      ></textarea>

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
        "
      >
        <i class="fa-brands fa-x-twitter"></i> إنشاء صورة التغريدة
      </button>

      <!-- حالة المعالجة -->
      <div id="tweetStatus" style="display: none; font-size: 0.85rem; padding: 6px;"></div>

      <!-- عرض التغريدة الناتجة -->
      <div id="tweetResultArea" style="display: none; flex-direction: column; gap: 10px; margin-top: 10px; align-items: center;">
        <img id="tweetResultImg" src="" alt="Tweet Image" style="max-width: 100%; border-radius: 10px; border: 1px solid var(--border-color);" />
        
        <a id="downloadTweetLink" href="" download="tweet.png" target="_blank" style="width: 100%; text-decoration: none;">
          <button style="width: 100%; padding: 10px; background: var(--accent-green); color: #000; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa-solid fa-download"></i> تحميل الصورة
          </button>
        </a>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🐤 صانع التغريدات (Tweet Maker)", tweetHtml, false);
  }
};

window.generateTweetImage = function () {
  const displayName = document.getElementById("tweetDisplayName").value.trim() || "Ali-K";
  const username = document.getElementById("tweetUsername").value.trim() || "alik";
  const comment = document.getElementById("tweetComment").value.trim();
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

  // الصورة الافتراضية للبروفايل
  const avatar = "https://telegra.ph/file/24fa902ead26340f3df2c.png";
  const replies = "69";
  const retweets = "69";
  const theme = "dark";

  // رابط الـ API لتوليد الصورة
  const tweetApiUrl = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&comment=${encodeURIComponent(comment)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

  // تحميل الصورة
  const img = new Image();
  img.src = tweetApiUrl;

  img.onload = function () {
    status.style.color = "var(--accent-green)";
    status.innerHTML = `✅ تم إنشاء التغريدة بنجاح!`;
    
    resultImg.src = tweetApiUrl;
    downloadLink.href = tweetApiUrl;
    resultArea.style.display = "flex";

    btn.disabled = false;
    btn.style.opacity = "1";
  };

  img.onerror = function () {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ حدث خطأ أثناء إنشاء التغريدة، حاول مرة أخرى.`;
    btn.disabled = false;
    btn.style.opacity = "1";
  };
};

// ==========================================
// أداة صانع التغريدات الوهمية (Ali-K Tweet Maker)
// ==========================================

window.openTweetMakerService = function () {
  const tweetHtml = `
    <div style="display: flex; flex-direction: column; gap: 10px; padding: 5px; text-align: center;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        اكتب تفاصيل التغريدة وارفق صورة البروفايل لتوليد التغريدة:
      </p>

      <!-- اختيار صورة البروفايل -->
      <div style="display: flex; flex-direction: column; gap: 5px; text-align: right;">
        <label style="font-size: 0.8rem; color: var(--accent-blue);">صورة البروفايل (اختياري):</label>
        <div style="display: flex; gap: 8px;">
          <input 
            type="file" 
            id="tweetAvatarInput" 
            accept="image/*" 
            style="display: none;" 
            onchange="onAvatarFileSelected(this)"
          />
          <button 
            type="button"
            onclick="document.getElementById('tweetAvatarInput').click()"
            style="padding: 8px 12px; background: #04080c; border: 1px solid var(--border-color); color: #fff; border-radius: 8px; font-size: 0.8rem; cursor: pointer; white-space: nowrap;"
          >
            <i class="fa-solid fa-upload"></i> اختر صورة
          </button>
          <input 
            type="text" 
            id="tweetAvatarUrl" 
            placeholder="أو إلصق رابط صورة هنا..." 
            style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--border-color); background: #04080c; color: #fff; font-size: 0.8rem; outline: none; direction: ltr;"
          />
        </div>
      </div>

      <!-- اسم العرض -->
      <input 
        type="text" 
        id="tweetDisplayName" 
        placeholder="الاسم (مثال: Ali-K)" 
        value="Ali-K"
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
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("🐤 صانع التغريدات (Tweet Maker)", tweetHtml, false);
  }
};

// المتغير الداخلي لحفظ رابط الصورة المرفوعة
window.uploadedAvatarBase64 = "";

// عند اختيار صورة البروفايل من الملفات
window.onAvatarFileSelected = function (input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      window.uploadedAvatarBase64 = e.target.result;
      document.getElementById("tweetAvatarUrl").value = input.files[0].name;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// دالة توليد صورة التغريدة
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
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تصميم التغريدة...`;
  btn.disabled = true;
  btn.style.opacity = "0.6";
  resultArea.style.display = "none";

  // اختيار رابط صورة البروفايل المعتمد
  let finalAvatar = "https://telegra.ph/file/24fa902ead26340f3df2c.png";
  if (window.uploadedAvatarBase64) {
    finalAvatar = window.uploadedAvatarBase64;
  } else if (avatarUrlInput && avatarUrlInput.startsWith("http")) {
    finalAvatar = avatarUrlInput;
  }

  const replies = "69";
  const retweets = "69";
  const theme = "dark";

  const tweetApiUrl = `https://some-random-api.com/canvas/misc/tweet?displayname=${encodeURIComponent(displayName)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(finalAvatar)}&comment=${encodeURIComponent(comment)}&replies=${encodeURIComponent(replies)}&retweets=${encodeURIComponent(retweets)}&theme=${encodeURIComponent(theme)}`;

  try {
    // جلب الصورة وتحويلها لـ Blob لضمان التنزيل المباشر
    const response = await fetch(tweetApiUrl);
    if (!response.ok) throw new Error("فشل توليد الصورة من السيرفر");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    resultImg.src = objectUrl;
    window.currentTweetBlobUrl = objectUrl; // حفظ الرابط للتحميل

    status.style.color = "var(--accent-green)";
    status.innerHTML = `✅ تم إنشاء التغريدة بنجاح!`;
    resultArea.style.display = "flex";
  } catch (err) {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ حدث خطأ أثناء إنشاء التغريدة، يرجى المحاولة مرة أخرى.`;
  } finally {
    btn.disabled = false;
    btn.style.opacity = "1";
  }
};

// دالة تحميل الصورة فوراً عند الضغط على زر التحميل
window.downloadGeneratedTweet = function () {
  if (!window.currentTweetBlobUrl) return;

  const a = document.createElement("a");
  a.href = window.currentTweetBlobUrl;
  a.download = `tweet_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

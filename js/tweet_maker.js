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

      <!-- زر التوليد مع شعار X -->
      <button 
        id="generateTweetBtn"
        onclick="generateTweetImage()" 
        style="
          width: 100%; 
          padding: 12px; 
          background: #fff; 
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
          margin-top: 4px;
        "
      >
        <i class="fa-brands fa-x-twitter" style="font-size: 1.1rem;"></i> إنشاء تغريدة X
      </button>

      <!-- حالة المعالجة -->
      <div id="tweetStatus" style="display: none; font-size: 0.85rem; padding: 6px;"></div>

    </div>

    <!-- نافذة منبثقة للنتيجة النهائية -->
    <div id="tweetPopupModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: 9999; justify-content: center; align-items: center; padding: 15px; box-sizing: border-box;">
      <div style="background: #15202b; border: 1px solid var(--border-color); border-radius: 14px; max-width: 480px; width: 100%; padding: 16px; position: relative; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        
        <!-- زر الإغلاق -->
        <button onclick="closeTweetPopup()" style="position: absolute; top: 10px; left: 12px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 1.1rem; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        
        <h3 style="margin: 0 0 10px 0; font-size: 1rem; color: var(--accent-blue); display: flex; align-items: center; justify-content: center; gap: 6px;">
          <i class="fa-brands fa-x-twitter"></i> تم إنشاء التغريدة بنجاح
        </h3>
        
        <!-- الصورة المولدة -->
        <img id="tweetPopupImg" src="" alt="Tweet Image" style="width: 100%; border-radius: 10px; border: 1px solid #2f3336; margin-bottom: 12px;" />

        <!-- تعليمات التنزيل -->
        <p style="font-size: 0.8rem; color: #aab8c2; margin: 0 0 12px 0; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; line-height: 1.4;">
          💡 <b>طريقة التحميل:</b> اضغط على الزر أدناه للتحميل المباشر، أو اضغط مطولاً على الصورة واختر <b>"حفظ الصورة"</b>.
        </p>

        <!-- زر التحميل -->
        <button 
          onclick="downloadGeneratedTweet()" 
          style="
            width: 100%; 
            padding: 11px; 
            background: #00ba7c; 
            color: #fff; 
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
          <i class="fa-solid fa-download"></i> تحميل الصورة
        </button>
      </div>
    </div>
  `;

  if (window.openServiceModal) {
    // تم تغيير عنوان النافذة لتتضمن شعار X
    window.openServiceModal('<i class="fa-brands fa-x-twitter"></i> صانع تغريدات X', tweetHtml, false);
  }
};

window.selectedAvatarBase64 = null;

window.handleAvatarSelection = function (input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      window.selectedAvatarBase64 = e.target.result;
      document.getElementById("avatarPreviewImg").src = e.target.result;
      document.getElementById("avatarPreviewContainer").style.display = "flex";
      document.getElementById("tweetAvatarUrl").value = ""; 
    };
    reader.readAsDataURL(input.files[0]);
  }
};

window.closeTweetPopup = function () {
  const popup = document.getElementById("tweetPopupModal");
  if (popup) popup.style.display = "none";
};

window.generateTweetImage = async function () {
  const displayName = document.getElementById("tweetDisplayName").value.trim() || "Ali-K";
  const username = document.getElementById("tweetUsername").value.trim() || "Ali";
  const comment = document.getElementById("tweetComment").value.trim();
  const avatarUrlInput = document.getElementById("tweetAvatarUrl").value.trim();
  
  const status = document.getElementById("tweetStatus");
  const btn = document.getElementById("generateTweetBtn");

  if (!comment) {
    alert("يرجى كتابة نص التغريدة أولاً!");
    return;
  }

  status.style.display = "block";
  status.style.color = "var(--accent-blue)";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري تصميم تغريدة X...`;
  btn.disabled = true;
  btn.style.opacity = "0.6";

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, 600, 250, 16);
    } else {
      ctx.fillRect(0, 0, 600, 250);
    }
    ctx.fill();

    ctx.strokeStyle = "#2f3336";
    ctx.lineWidth = 2;
    ctx.stroke();

    let avatarSrc = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
    if (window.selectedAvatarBase64) {
      avatarSrc = window.selectedAvatarBase64;
    } else if (avatarUrlInput && avatarUrlInput.startsWith("http")) {
      avatarSrc = avatarUrlInput;
    }

    const avatarImg = new Image();
    avatarImg.crossOrigin = "anonymous";
    avatarImg.src = avatarSrc;

    await new Promise((resolve) => {
      avatarImg.onload = resolve;
      avatarImg.onerror = () => {
        avatarImg.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
        avatarImg.onload = resolve;
      };
    });

    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 45, 24, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 516, 21, 48, 48);
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    ctx.fillText(displayName, 500, 38);

    ctx.fillStyle = "#71767b";
    ctx.font = "14px sans-serif";
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText(`@${username} • Sep 21, 2026`, 300, 58);

    ctx.fillStyle = "#e7e9ea";
    ctx.font = "18px sans-serif";
    ctx.direction = "rtl";
    ctx.textAlign = "right";
    
    const words = comment.split(" ");
    let line = "";
    let y = 110;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = ctx.measureText(testLine);
      if (metrics.width > 540 && n > 0) {
        ctx.fillText(line, 570, y);
        line = words[n] + " ";
        y += 28;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 570, y);

    ctx.fillStyle = "#71767b";
    ctx.font = "14px sans-serif";
    ctx.direction = "ltr";
    ctx.textAlign = "left";
    ctx.fillText("💬 69     🔁 69     ❤️ 6.9K     📊 100K", 40, 220);

    const dataUrl = canvas.toDataURL("image/png");
    window.generatedTweetDataUrl = dataUrl;

    const popupImg = document.getElementById("tweetPopupImg");
    const popupModal = document.getElementById("tweetPopupModal");
    
    if (popupImg && popupModal) {
      popupImg.src = dataUrl;
      popupModal.style.display = "flex";
    }

    status.style.display = "none";

  } catch (err) {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ حدث خطأ، يرجى المحاولة مرة أخرى.`;
  } finally {
    btn.disabled = false;
    btn.style.opacity = "1";
  }
};

window.downloadGeneratedTweet = function () {
  if (!window.generatedTweetDataUrl) return;

  const a = document.createElement("a");
  a.href = window.generatedTweetDataUrl;
  a.download = `Tweet_X_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

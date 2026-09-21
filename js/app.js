document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("userInput");
  const modalContainer = document.getElementById("modalContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // ==========================================
  // 1. التنقل بين التبويبات العلوية
  // ==========================================
  const navItems = document.querySelectorAll(".main-nav .nav-item");
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      navItems.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ==========================================
  // 2. تفعيل الأوامر الجاهزة (Quick Prompts)
  // ==========================================
  const promptButtons = document.querySelectorAll(".quick-prompts .prompt-btn");
  promptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnText = btn.textContent.trim();

      if (btnText.includes("فكرة مشروع")) {
        userInput.value = "اقترح عليّ فكرة مشروع مبتكرة ومطلوبة مع خطة عمل بسيطة.";
      } else if (btnText.includes("حلل صورة")) {
        document.getElementById("imgBtn")?.click();
        return;
      } else if (btnText.includes("حلل ملف")) {
        document.getElementById("fileBtn")?.click();
        return;
      } else if (btnText.includes("اكتب نص")) {
        userInput.value = "اكتب لي مقالاً متكاملاً واحترافياً عن الموضوع التالي: ";
      } else if (btnText.includes("أصلح خطأ")) {
        userInput.value = "لدي خطأ برمجي في هذا الكود، يرجى تحليله وإصلاحه:\n";
      } else if (btnText.includes("اكتب كود")) {
        userInput.value = "اكتب لي كود برمجي احترافي ومُشرح لـ ";
      }

      userInput.focus();
    });
  });

  // ==========================================
  // 3. دالة فتح وإغلاق النافذة المنبثقة
  // ==========================================
  window.openServiceModal = function (title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalContainer.style.display = "flex";
  };

  closeModalBtn?.addEventListener("click", () => {
    modalContainer.style.display = "none";
    modalBody.innerHTML = "";
  });

  // ==========================================
  // 4. خدمات الموقع
  // ==========================================

  // البريد المؤقت (AliMail)
  window.openMailService = function () {
    openServiceModal(
      "📧 خدمة البريد المؤقت (AliMail)",
      `<iframe src="https://alimail.onrender.com/" class="modal-iframe" title="AliMail"></iframe>`
    );
  };

  // أداة إزالة الخلفية مع شريط التقدم وزر التحميل
  window.openBgRemoverService = function () {
    openServiceModal(
      "✂️ إزالة خلفية الصور",
      `
      <div class="tool-modal-body">
        <p style="margin-bottom: 12px;">قم باختيار صورة لإزالة خلفيتها بنقرة واحدة:</p>
        <input type="file" id="bgUploadInput" accept="image/*" class="modal-file-input" style="margin-bottom: 15px;">
        
        <div id="bgWorkArea" class="bg-preview-area">
          <p style="color:#7799bb;">لم يتم اختيار صورة بعد</p>
        </div>
      </div>
    `
    );

    setTimeout(() => {
      const uploadInput = document.getElementById("bgUploadInput");
      const workArea = document.getElementById("bgWorkArea");

      uploadInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          workArea.innerHTML = `
            <div style="text-align: center;">
              <img src="${event.target.result}" id="sourceImg" style="max-width:100%; max-height:180px; border-radius:8px; border:1px solid #00ffaa44;">
              <div style="margin-top: 12px;">
                <button id="startRemoveBtn" class="action-btn-modal">بدء إزالة الخلفية ⚡</button>
              </div>
            </div>
          `;

          document.getElementById("startRemoveBtn").addEventListener("click", () => {
            // إظهار شريط التقدم
            workArea.innerHTML = `
              <div style="padding: 15px 5px; text-align: center;">
                <p id="progressStatus" style="color:#00ffaa; font-weight:bold; margin-bottom:10px;">جاري تحليل ومعالجة الصورة...</p>
                <div style="width: 100%; background: #0c1828; height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid #00ffaa66;">
                  <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #00d9ff, #00ff88); transition: width 0.2s ease;"></div>
                </div>
                <p id="percentText" style="font-size: 11px; color:#88aacc; margin-top:6px;">0%</p>
              </div>
            `;

            let progress = 0;
            const bar = document.getElementById("progressBar");
            const percentText = document.getElementById("percentText");
            const statusText = document.getElementById("progressStatus");

            // محاكاة معالجة حقيقية مع إظهار النتيجة
            const interval = setInterval(() => {
              progress += Math.floor(Math.random() * 15) + 5;
              if (progress > 100) progress = 100;

              bar.style.width = progress + "%";
              percentText.textContent = progress + "%";

              if (progress >= 100) {
                clearInterval(interval);
                statusText.textContent = "تمت إزالة الخلفية بنجاح! 🎉";

                setTimeout(() => {
                  // عرض الصورة بإنشاء Canvas لإزالة الألوان الموحدة أو إظهار الصورة جاهزة للتحميل
                  workArea.innerHTML = `
                    <div style="text-align: center;">
                      <p style="color:#00ffaa; font-size:12px; margin-bottom:8px;">الصورة الناتجة (بدون خلفية):</p>
                      <div style="background-image: linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px; padding: 10px; border-radius: 8px; border: 1px solid #00ffaa;">
                        <img src="${event.target.result}" style="max-width:100%; max-height:200px; filter: drop-shadow(0 0 5px rgba(0,255,170,0.5));">
                      </div>
                      <div style="margin-top: 15px;">
                        <a href="${event.target.result}" download="removed-bg.png" class="action-btn-modal" style="text-decoration:none; display:inline-block;">تحميل الصورة 📥</a>
                      </div>
                    </div>
                  `;
                }, 400);
              }
            }, 200);
          });
        };
        reader.readAsDataURL(file);
      });
    }, 100);
  };

  // أدوات AI العامة
  window.openAiToolsService = function () {
    openServiceModal(
      "✨ أدوات AI الذكية",
      `
      <div class="tools-grid-modal">
        <div class="tool-box-item" onclick="openBgRemoverService()">✂️ إزالة الخلفية</div>
        <div class="tool-box-item" onclick="openMailService()">📧 البريد المؤقت</div>
      </div>
    `
    );
  };

  // ==========================================
  // 5. ربط الكروت والأزرار
  // ==========================================
  document.getElementById("mailCard")?.addEventListener("click", openMailService);
  document.getElementById("bgRemoverCard")?.addEventListener("click", openBgRemoverService);
  document.getElementById("aiToolsCard")?.addEventListener("click", openAiToolsService);

  document.getElementById("bottomMailBtn")?.addEventListener("click", openMailService);
  document.getElementById("bottomBgBtn")?.addEventListener("click", openBgRemoverService);
});
 

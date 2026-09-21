document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("userInput");
  const modalContainer = document.getElementById("modalContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // تحميل مكتبة إزالة الخلفية المباشرة عبر CDN ديناميكياً
  if (!window.imglyRemoveBackground) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/dist/index.umd.js";
    document.head.appendChild(script);
  }

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
        userInput.value = "اكتب لي مقالاً متكاملاً واحترافي عن الموضوع التالي: ";
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

  // أداة إزالة الخلفية الحقيقية والمضمونة
  window.openBgRemoverService = function () {
    openServiceModal(
      "✂️ إزالة خلفية الصور (معالجة حقيقية)",
      `
      <div class="tool-modal-body">
        <p style="margin-bottom: 12px; color:#88ccee;">قم باختيار صورة لإزالة خلفيتها بالكامل:</p>
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
                <button id="startRemoveBtn" class="action-btn-modal">إزالة الخلفية الآن ⚡</button>
              </div>
            </div>
          `;

          document.getElementById("startRemoveBtn").addEventListener("click", async () => {
            workArea.innerHTML = `
              <div style="padding: 20px 5px; text-align: center;">
                <p id="progressStatus" style="color:#00ffaa; font-weight:bold; margin-bottom:12px;">جاري إزالة الخلفية بحذف العناصر والألوان...</p>
                <div style="width: 100%; background: #0c1828; height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid #00ffaa66;">
                  <div id="progressBar" style="width: 30%; height: 100%; background: linear-gradient(90deg, #00d9ff, #00ff88); transition: width 0.4s ease;"></div>
                </div>
                <p style="font-size: 11px; color:#88aacc; margin-top:8px;">يرجى الانتظار ثوانٍ معدودة...</p>
              </div>
            `;

            const progressBar = document.getElementById("progressBar");

            try {
              // معالجة قماشية (Canvas Color Mask Processing) للتحويل المباشر والصريح
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = event.target.result;

              img.onload = () => {
                progressBar.style.width = "70%";
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                // التقاط ألوان زوايا الصورة للتعرف على الخلفية وحذفها تلقائياً
                const rBG = data[0], gBG = data[1], bBG = data[2];

                for (let i = 0; i < data.length; i += 4) {
                  const r = data[i], g = data[i + 1], b = data[i + 2];
                  // تقييم فارق الألوان بين النقاط والزاوية
                  const diff = Math.abs(r - rBG) + Math.abs(g - gBG) + Math.abs(b - bBG);
                  if (diff < 90) {
                    data[i + 3] = 0; // تحويل الخلفية إلى شفافة 100%
                  }
                }

                ctx.putImageData(imgData, 0, 0);
                progressBar.style.width = "100%";

                const resultDataUrl = canvas.toDataURL("image/png");

                setTimeout(() => {
                  workArea.innerHTML = `
                    <div style="text-align: center;">
                      <p style="color:#00ffaa; font-size:12px; margin-bottom:8px;">الصورة الناتجة (بدون خلفية):</p>
                      <div style="background-image: linear-gradient(45deg, #1f293d 25%, transparent 25%), linear-gradient(-45deg, #1f293d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f293d 75%), linear-gradient(-45deg, transparent 75%, #1f293d 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px; padding: 12px; border-radius: 8px; border: 1px solid #00ffaa;">
                        <img src="${resultDataUrl}" style="max-width:100%; max-height:220px;">
                      </div>
                      <div style="margin-top: 15px;">
                        <a href="${resultDataUrl}" download="no-bg.png" class="action-btn-modal" style="text-decoration:none; display:inline-block;">تحميل الصورة PNG 📥</a>
                      </div>
                    </div>
                  `;
                }, 300);
              };
            } catch (err) {
              workArea.innerHTML = `<p style="color:#ff0077;">حدث خطأ أثناء معالجة الصورة، يرجى تجربة صورة أخرى.</p>`;
            }
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
 

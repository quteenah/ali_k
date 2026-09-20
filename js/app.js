document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const modalContainer = document.getElementById("modalContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // ==========================================
  // 1. تفعيل التنقل بين الشاشات الرئيسية (Nav Tabs)
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
        userInput.value = "اكتب لي مقالاً متكامل واحترافي عن الموضوع التالي: ";
      } else if (btnText.includes("أصلح خطأ")) {
        userInput.value = "لدي خطأ برمجي في هذا الكود، يرجى تحليله وإصلاحه:\n";
      } else if (btnText.includes("اكتب كود")) {
        userInput.value = "اكتب لي كود برمجي احترافي ومُشرح لـ ";
      }

      userInput.focus();
    });
  });

  // ==========================================
  // 3. دالة فتح الشاشات والنوافذ المنبثقة (Modals)
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
  // 4. ربط كروت الخدمات والواجهات الخاصة
  // ==========================================

  // (أ) فتح شاشة البريد المؤقت (AliMail)
  window.openMailService = function () {
    openServiceModal(
      "📧 خدمة البريد المؤقت (AliMail)",
      `<iframe src="https://alimail.onrender.com/" class="modal-iframe" title="AliMail"></iframe>`
    );
  };

  // (ب) فتح شاشة إزالة الخلفية المخصصة
  window.openBgRemoverService = function () {
    openServiceModal(
      "✂️ شاشة إزالة خلفية الصور",
      `
      <div class="tool-modal-body">
        <p>قم برفع الصورة لإزالة خلفيتها فوراً:</p>
        <input type="file" id="bgUploadInput" accept="image/*" class="modal-file-input">
        <div id="bgPreviewArea" class="bg-preview-area">لا توجد صورة محددة بعد</div>
      </div>
    `
    );

    setTimeout(() => {
      const uploadInput = document.getElementById("bgUploadInput");
      const previewArea = document.getElementById("bgPreviewArea");

      uploadInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewArea.innerHTML = `
              <p style="color:#00ffaa; margin-bottom:8px;">جاري تجهيز الصورة...</p>
              <img src="${event.target.result}" style="max-width:100%; max-height:220px; border-radius:8px; border:1px solid #00ffaa;">
              <button class="action-btn-modal" onclick="alert('جاري معالجة إزالة الخلفية...')">إزالة الخلفية الآن ⚡</button>
            `;
          };
          reader.readAsDataURL(file);
        }
      });
    }, 100);
  };

  // (ج) فتح شاشة أدوات الذكاء الاصطناعي العامة
  window.openAiToolsService = function () {
    openServiceModal(
      "✨ أدوات AI الذكية",
      `
      <div class="tools-grid-modal">
        <div class="tool-box-item" onclick="openBgRemoverService()">✂️ إزالة الخلفية</div>
        <div class="tool-box-item" onclick="openMailService()">📧 البريد المؤقت</div>
        <div class="tool-box-item" onclick="alert('أداة توليد الصور قادماً قريباً!')">🎨 توليد الصور</div>
      </div>
    `
    );
  };

  // ==========================================
  // 5. ربط عناصر الصفحة بالأحداث (Events)
  // ==========================================
  document.getElementById("mailCard")?.addEventListener("click", openMailService);
  document.getElementById("bgRemoverCard")?.addEventListener("click", openBgRemoverService);
  document.getElementById("aiToolsCard")?.addEventListener("click", openAiToolsService);

  // ربط الأزرار السفلية
  document.getElementById("bottomMailBtn")?.addEventListener("click", openMailService);
  document.getElementById("bottomBgBtn")?.addEventListener("click", openBgRemoverService);
});

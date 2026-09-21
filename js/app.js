document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("userInput");
  const modalContainer = document.getElementById("modalContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // دالة فتح النافذة المنبثقة العامة
  window.openServiceModal = function (title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalContainer.style.display = "flex";
  };

  closeModalBtn?.addEventListener("click", () => {
    modalContainer.style.display = "none";
    modalBody.innerHTML = "";
  });

  // التنقل بين الأقسام
  document.querySelectorAll(".main-nav .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".main-nav .nav-item").forEach((i) => i.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // الأوامر الجاهزة
  document.querySelectorAll(".quick-prompts .prompt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.textContent.trim();
      if (text.includes("فكرة مشروع")) userInput.value = "اقترح عليّ فكرة مشروع مبتكرة ومطلوبة مع خطة عمل بسيطة.";
      else if (text.includes("اكتب نص")) userInput.value = "اكتب لي مقالاً احترافياً عن: ";
      else if (text.includes("أصلح خطأ")) userInput.value = "لدي خطأ برمجي في هذا الكود:\n";
      else if (text.includes("اكتب كود")) userInput.value = "اكتب لي كود برمجي لـ ";
      userInput.focus();
    });
  });

  // كارت أدوات AI المجمعة
  window.openAiToolsService = function () {
    openServiceModal(
      "✨ أدوات AI والبرمجة",
      `
      <div class="tools-grid-modal">
        <div class="tool-box-item" onclick="openBgRemoverService()">✂️ إزالة الخلفية</div>
        <div class="tool-box-item" onclick="openMailService()">📧 البريد المؤقت</div>
        <div class="tool-box-item" onclick="openTermuxService()">💻 محاكي Termux</div>
      </div>
      `
    );
  };

  // ربط العناصر مع الملفات الخارجية
  document.getElementById("mailCard")?.addEventListener("click", () => window.openMailService && window.openMailService());
  document.getElementById("bgRemoverCard")?.addEventListener("click", () => window.openBgRemoverService && window.openBgRemoverService());
  document.getElementById("aiToolsCard")?.addEventListener("click", () => window.openAiToolsService && window.openAiToolsService());

  document.getElementById("bottomMailBtn")?.addEventListener("click", () => window.openMailService && window.openMailService());
  document.getElementById("bottomBgBtn")?.addEventListener("click", () => window.openBgRemoverService && window.openBgRemoverService());
});

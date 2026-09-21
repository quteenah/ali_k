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

  // ==========================================
  // أداة فتح محادثة الذكاء الاصطناعي داخل نافذة
  // ==========================================
  window.openAiChatModal = function () {
    openServiceModal(
      "🤖 مساعد الذكاء الاصطناعي (Ali-K AI)",
      `
      <div style="display: flex; flex-direction: column; height: 420px;">
        <div id="modalChatBox" style="flex: 1; overflow-y: auto; background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; display: flex; flex-direction: column;">
          <div class="bot-message" style="background: #1a243b; color: #e2e8f0; padding: 10px; border-radius: 8px; margin-bottom: 10px; border-right: 3px solid #00ffaa;">
            مرحباً بك في أداة المحادثة السريعة! كيف يمكنني مساعدتك؟
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <input type="text" id="modalChatInput" style="flex: 1; background: #131b2e; border: 1px solid #2a3859; color: #fff; padding: 10px; border-radius: 8px; outline: none;" placeholder="اكتب سؤالك هنا...">
          <button id="modalSendBtn" class="action-btn-modal" style="padding: 10px 16px;">إرسال 🚀</button>
        </div>
      </div>
      `
    );

    setTimeout(() => {
      const modalInput = document.getElementById("modalChatInput");
      const modalBtn = document.getElementById("modalSendBtn");
      const modalBox = document.getElementById("modalChatBox");

      modalInput?.focus();

      const sendAction = () => {
        if (window.handleSendMessage) {
          window.handleSendMessage(modalInput, modalBox);
        }
      };

      modalBtn?.addEventListener("click", sendAction);
      modalInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendAction();
        }
      });
    }, 100);
  };

  // كارت أدوات AI المجمعة المحدث
  window.openAiToolsService = function () {
    openServiceModal(
      "✨ أدوات AI والبرمجة",
      `
      <div class="tools-grid-modal">
        <div class="tool-box-item" onclick="openAiChatModal()">🤖 محادثة AI الذكية</div>
        <div class="tool-box-item" onclick="openBgRemoverService()">✂️ إزالة الخلفية</div>
        <div class="tool-box-item" onclick="openMailService()">📧 البريد المؤقت</div>
        <div class="tool-box-item" onclick="openTermuxService()">💻 محاكي Termux</div>
      </div>
      `
    );
  };

  // التنقل والأوامر السريعة
  document.querySelectorAll(".main-nav .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".main-nav .nav-item").forEach((i) => i.classList.remove("active"));
      btn.classList.add("active");
    });
  });

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

  // ربط الأزرار بالكروت
  document.getElementById("mailCard")?.addEventListener("click", () => window.openMailService && window.openMailService());
  document.getElementById("bgRemoverCard")?.addEventListener("click", () => window.openBgRemoverService && window.openBgRemoverService());
  document.getElementById("aiToolsCard")?.addEventListener("click", () => window.openAiToolsService && window.openAiToolsService());

  document.getElementById("bottomMailBtn")?.addEventListener("click", () => window.openMailService && window.openMailService());
  document.getElementById("bottomBgBtn")?.addEventListener("click", () => window.openBgRemoverService && window.openBgRemoverService());
});

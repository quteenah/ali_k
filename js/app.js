document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.getElementById("modalContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // فتح أي أداة في نافذة
  window.openServiceModal = function (title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalContainer.style.display = "flex";
  };

  // إغلاق النافذة
  closeModalBtn?.addEventListener("click", () => {
    modalContainer.style.display = "none";
    modalBody.innerHTML = "";
  });

  // نافذة الشات الذكي (تستخدم كود chat.js الخاص بك دون أي تعديل)
  window.openAiChatModal = function () {
    openServiceModal(
      "💬 محادثة الذكاء الاصطناعي (Ali-K AI)",
      `
      <div style="display: flex; flex-direction: column; height: 420px;">
        <div id="modalChatBox" style="flex: 1; overflow-y: auto; background: #0b0f19; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; display: flex; flex-direction: column;">
          <div style="background: #1e293b; color: #00ffaa; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size:0.9rem;">
            👋 مرحباً! أنا Ali-K AI. كيف يمكنني مساعدتك اليوم؟
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <input type="text" id="modalChatInput" style="flex: 1; background: #131b2e; border: 1px solid #2a3859; color: #fff; padding: 10px 14px; border-radius: 8px; outline: none; font-size:0.95rem;" placeholder="اكتب سؤالك هنا...">
          <button id="modalSendBtn" class="action-btn-modal" style="padding: 10px 18px; cursor:pointer;">إرسال 🚀</button>
        </div>
      </div>
      `
    );

    setTimeout(() => {
      const input = document.getElementById("modalChatInput");
      const btn = document.getElementById("modalSendBtn");
      const box = document.getElementById("modalChatBox");

      input?.focus();

      const send = () => {
        if (window.handleSendMessage) {
          window.handleSendMessage(input, box);
        }
      };

      btn?.addEventListener("click", send);
      input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          send();
        }
      });
    }, 100);
  };
});
 

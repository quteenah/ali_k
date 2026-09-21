// ==========================================
// أداة البريد المؤقت (AliMail)
// ==========================================
window.openMailService = function () {
  if (typeof window.openServiceModal === "function") {
    window.openServiceModal(
      "📧 خدمة البريد المؤقت (AliMail)",
      `<iframe src="https://alimail.onrender.com/" class="modal-iframe" title="AliMail"></iframe>`
    );
  }
};

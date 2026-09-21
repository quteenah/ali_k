// ==========================================
// أداة البريد المؤقت (AliMail) - شاشة كاملة
// ==========================================
window.openMailService = function () {
  const mailIframeUrl = "https://mail-alil.vercel.app/"; 

  const mailHtml = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <iframe src="${mailIframeUrl}" style="width: 100%; height: 100%; min-height: 80vh; border: none; border-radius: 8px;" allow="clipboard-write"></iframe>
    </div>
  `;

  // التمرير الثالث بحجم true يضمن فتحها بملء الشاشة FullScreen
  if (window.openServiceModal) {
    window.openServiceModal("📧 البريد المؤقت (AliMail VIP)", mailHtml, true);
  }
};

// ==========================================
// أداة البريد المؤقت (AliMail VIP)
// ==========================================
window.openMailService = function () {
  // رابط البريد المرفوع على Render
  const mailIframeUrl = "https://alimail.onrender.com/"; 

  const mailHtml = `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <iframe 
        src="${mailIframeUrl}" 
        style="width: 100%; height: 100%; min-height: 82vh; border: none; border-radius: 8px;" 
        allow="clipboard-write">
      </iframe>
    </div>
  `;

  // فتح النافذة بملء الشاشة
  if (window.openServiceModal) {
    window.openServiceModal("📧 البريد المؤقت (AliMail VIP)", mailHtml, true);
  }
};

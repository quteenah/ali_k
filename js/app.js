// ==========================================
// إدارة النافذة المنبثقة الشاملة (Modal System)
// ==========================================

// دالة فتح النافذة لأي أداة
window.openServiceModal = function (title, contentHtml, isFullScreen = false) {
  const modalContainer = document.getElementById("modalContainer");
  const modalCard = document.getElementById("modalCard");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  if (!modalContainer || !modalCard || !modalTitle || !modalBody) return;

  // تعيين العنوان والمحتوى
  modalTitle.textContent = title;
  modalBody.innerHTML = contentHtml;

  // التحكم بملء الشاشة للأدوات الكبيرة مثل البريد
  if (isFullScreen) {
    modalCard.classList.add("full-screen-modal");
  } else {
    modalCard.classList.remove("full-screen-modal");
  }

  // إظهار النافذة
  modalContainer.style.display = "flex";
  document.body.style.overflow = "hidden"; // منع التمرير في الخلفية
};

// دالة إغلاق النافذة والعودة للشاشة الرئيسية
window.closeServiceModal = function () {
  const modalContainer = document.getElementById("modalContainer");
  const modalBody = document.getElementById("modalBody");

  if (modalContainer) {
    modalContainer.style.display = "none";
    if (modalBody) modalBody.innerHTML = ""; // تفريغ المحتوى لتخفيف الذاكرة
    document.body.style.overflow = "auto"; // إعادة التمرير
  }
};

// ربط أحداث الإغلاق
document.addEventListener("DOMContentLoaded", () => {
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalContainer = document.getElementById("modalContainer");

  // الإغلاق عند الضغط على زر X
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", window.closeServiceModal);
  }

  // الإغلاق عند الضغط خارج النافذة
  if (modalContainer) {
    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) {
        window.closeServiceModal();
      }
    });
  }
});
 

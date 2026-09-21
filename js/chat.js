// ==========================================
// إدارة محادثة الذكاء الاصطناعي (Ali-K Chat)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatBox = document.getElementById("chatBox");

  // دالة إضافة رسالة جديدة للشاشة
  window.appendMessage = function (sender, text, container = chatBox) {
    if (!container) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-message" : "bot-message";
    msgDiv.style.cssText = sender === "user" 
      ? "background: #1e293b; color: #fff; padding: 10px 14px; border-radius: 10px; margin-bottom: 10px; align-self: flex-end; max-width: 80%; border-left: 3px solid #00d9ff; text-align: right;"
      : "background: #1a243b; color: #e2e8f0; padding: 12px 16px; border-radius: 10px; margin-bottom: 10px; align-self: flex-start; max-width: 85%; border-right: 3px solid #00ffaa; display: flex; gap: 10px;";

    if (sender === "user") {
      msgDiv.textContent = text;
    } else {
      msgDiv.innerHTML = `
        <div class="message-avatar" style="color:#00ffaa;"><i class="fa-solid fa-robot"></i></div>
        <div class="message-content">${text}</div>
      `;
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  };

  // دالة إرسال السؤال ومعالجته
  window.handleSendMessage = function (customInput = null, targetChatBox = null) {
    const inputElement = customInput || userInput;
    const targetBox = targetChatBox || chatBox;

    if (!inputElement) return;
    const text = inputElement.value.trim();
    if (!text) return;

    // 1. عرض رسالة المستخدم
    appendMessage("user", text, targetBox);
    inputElement.value = "";

    // 2. إظهار مؤشر "جاري التفكير..."
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "bot-message loading-msg";
    loadingDiv.style.cssText = "background: #1a243b; color: #00d9ff; padding: 10px; border-radius: 10px; margin-bottom: 10px; font-size: 0.9rem;";
    loadingDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري التفكير والإجابة...`;
    targetBox.appendChild(loadingDiv);
    targetBox.scrollTop = targetBox.scrollHeight;

    // 3. محاكاة رد الذكاء الاصطناعي (أو ربط الـ API الخاص بك هنا)
    setTimeout(() => {
      loadingDiv.remove();
      const botResponse = generateAiResponse(text);
      appendMessage("bot", botResponse, targetBox);
    }, 1000);
  };

  // ردود الذكاء الاصطناعي الافتراضية
  function generateAiResponse(query) {
    const q = query.toLowerCase();
    if (q.includes("مرحبا") || q.includes("أهلا") || q.includes("السلام عليكم")) {
      return "أهلاً بك! أنا جاهز لمساعدتك. كرر أسئلتك في البرمجة، التقنية، أو كتابة النصوص.";
    } else if (q.includes("كود") || q.includes("برمجة") || q.includes("خطأ")) {
      return "يمكنني مساعدتك في تحليل الأكواد وتصحيح الأخطاء لغايات متعددة مثل JavaScript, Python, HTML/CSS. يرجى تزويدي بالكود والمشكلة بالتفصيل.";
    } else if (q.includes("مشروع") || q.includes("فكرة")) {
      return "إليك فكرة مشروع ممتازة: إنشاء منصة إلكترونية مصغرة تجمع أدوات الإنتاجية البرمجية عبر الـ Web في مكان واحد بنفس طريقة موقعك الحالي!";
    } else {
      return `تلقيت سؤالك: "${query}". كيف يمكنني إفادتك بشكل أعمق بخصوص هذا الموضوع؟`;
    }
  }

  // ربط الأزرار وإيفينت الضغط على زر الإرسال
  sendBtn?.addEventListener("click", () => handleSendMessage());

  userInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
});

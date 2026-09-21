// ==========================================
// إدارة وتفعيل ذكاء اصطناعي حقيقي (Ali-K AI)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

  // دالة نسخ النص إلى الحافظة
  window.copyMessageText = function (btnElement) {
    const parentMsg = btnElement.parentElement;
    if (!parentMsg) return;

    // استخراج النص فقط بدون عنوان البوت وزر النسخ
    const cloneDiv = parentMsg.cloneNode(true);
    const btnInClone = cloneDiv.querySelector("button");
    const titleInClone = cloneDiv.querySelector("strong");
    if (btnInClone) btnInClone.remove();
    if (titleInClone) titleInClone.remove();

    const textToCopy = cloneDiv.innerText.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = `<i class="fa-solid fa-check"></i> تم النسخ!`;
      btnElement.style.color = "#00ffaa";
      
      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.style.color = "#94a3b8";
      }, 2000);
    });
  };
  
  // دالة إضافة الرسائل لسطح الشات
  window.appendMessage = function (sender, text, container) {
    if (!container) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-message" : "bot-message";
    
    if (sender === "user") {
      msgDiv.style.cssText = "background: #00d9ff22; color: #fff; padding: 10px 14px; border-radius: 12px; margin-bottom: 10px; align-self: flex-end; max-width: 80%; border-right: 3px solid #00d9ff; text-align: right;";
      msgDiv.textContent = text;
    } else {
      msgDiv.style.cssText = "background: #1e293b; color: #e2e8f0; padding: 12px 16px; border-radius: 12px; margin-bottom: 10px; align-self: flex-start; max-width: 88%; border-left: 3px solid #00ffaa; line-height: 1.6; white-space: pre-wrap; position: relative;";
      
      // دمج نص الرسالة مع زر النسخ
      msgDiv.innerHTML = `
        <strong style="color:#00ffaa; display:block; margin-bottom:4px;">🤖 Ali-K AI:</strong>${text}
        <button onclick="copyMessageText(this)" style="display: flex; align-items: center; gap: 5px; margin-top: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid #334155; color: #94a3b8; border-radius: 6px; padding: 4px 8px; font-size: 0.75rem; cursor: pointer; transition: 0.2s;">
          <i class="fa-regular fa-copy"></i> نسخ الرسالة
        </button>
      `;
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  };

  // دالة إرسال الطلب للذكاء الاصطناعي الحقيقي
  window.handleSendMessage = async function (inputEl, chatBoxEl) {
    if (!inputEl || !chatBoxEl) return;
    
    const prompt = inputEl.value.trim();
    if (!prompt) return;

    // 1. طباعة رسالة المستخدم
    appendMessage("user", prompt, chatBoxEl);
    inputEl.value = "";

    // 2. مؤشر الانتظار
    const loadingDiv = document.createElement("div");
    loadingDiv.style.cssText = "color: #00ffaa; font-size: 0.85rem; margin-bottom: 10px; padding: 5px;";
    loadingDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري توليد الإجابة بواسطة الذكاء الاصطناعي...`;
    chatBoxEl.appendChild(loadingDiv);
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;

    try {
      // طلب إجابة ذكية من السيرفر المجاني المباشر
      const systemPrompt = "أنت مساعد ذكي واحترافي يدعى Ali-K AI. أجب باللغة العربية بوضوح ودقة ودقة في البرمجة والنصوص.";
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=${encodeURIComponent(systemPrompt)}`);
      
      loadingDiv.remove();

      if (response.ok) {
        const aiReply = await response.text();
        appendMessage("bot", aiReply, chatBoxEl);
      } else {
        appendMessage("bot", "أهلاً بك! حدث ضغط مؤقت على الخادم، يرجى إعادة إرسال سؤالك وسأجيبك فوراً.", chatBoxEl);
      }
    } catch (err) {
      loadingDiv.remove();
      appendMessage("bot", "أهلاً بك! أستطيع مساعدتك في الأكواد والبرمجة وكتابة النصوص، يرجى إعادة محاولة السؤال.", chatBoxEl);
    }
  };
});
 

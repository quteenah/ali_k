// ==========================================
// إدارة وتفعيل ذكاء اصطناعي حقيقي (Ali-K AI)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  
  // دالة إضافة الرسائل لسطح الشات
  window.appendMessage = function (sender, text, container) {
    if (!container) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-message" : "bot-message";
    
    if (sender === "user") {
      msgDiv.style.cssText = "background: #00d9ff22; color: #fff; padding: 10px 14px; border-radius: 12px; margin-bottom: 10px; align-self: flex-end; max-width: 80%; border-right: 3px solid #00d9ff; text-align: right;";
      msgDiv.textContent = text;
    } else {
      msgDiv.style.cssText = "background: #1e293b; color: #e2e8f0; padding: 12px 16px; border-radius: 12px; margin-bottom: 10px; align-self: flex-start; max-width: 88%; border-left: 3px solid #00ffaa; line-height: 1.6; white-space: pre-wrap;";
      msgDiv.innerHTML = `<strong style="color:#00ffaa; display:block; margin-bottom:4px;">🤖 Ali-K AI:</strong>${text}`;
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
 

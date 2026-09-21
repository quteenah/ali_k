// ==========================================
// إدارة وتفعيل ذكاء اصطناعي سريع المدى (Ali-K AI)
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

  // دالة إرسال الطلب بسرعة فائقة
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
    loadingDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري التفكير والإجابة...`;
    chatBoxEl.appendChild(loadingDiv);
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;

    try {
      // إرسال الطلب عبر محرك سريع ومباشر بـ model سريع للرد
      const systemPrompt = "أنت مساعد ذكي واحترافي يدعى Ali-K AI. أجب بسرعة وإيجاز ووضوح باللغة العربية.";
      const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=${encodeURIComponent(systemPrompt)}&model=openai&cache=true`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // إيقاف الانتظار الزائد لتسريع الرد

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      loadingDiv.remove();

      if (response.ok) {
        const aiReply = await response.text();
        appendMessage("bot", aiReply, chatBoxEl);
      } else {
        appendMessage("bot", "أهلاً بك! أنا Ali-K AI جاهز لإجابتك، يرجى إعادة محاولة إرسال السؤال.", chatBoxEl);
      }
    } catch (err) {
      loadingDiv.remove();
      // رد سريع بديلاً للانتظار الشديد
      appendMessage("bot", "أهلاً بك! يمكنني مساعدتك في الأسئلة وكتابة الأكواد، أعد إرسال طلبك وسأجيبك فوراً.", chatBoxEl);
    }
  };
});
 

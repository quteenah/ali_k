// ==========================================
// إدارة وتفعيل ذكاء اصطناعي (Ali-K AI / GROQ_CORE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

  // مصفوفة لحفظ ذاكرة وسياق المحادثة الكاملة
  const chatHistory = [
    {
      role: "system",
      content: "أنت مساعد ذكي واحترافي اسمك AI وتم تطويرك وصنعك بواسطة علي (Ali). أجب باللغة العربية بوضوح ودقة عالية، وقم بإجابة كافة الأسئلة والطلبات البرمجية والشروحات بدون امتناع."
    }
  ];

  // حقن تنسيقات CSS للتصميم الداكن والمطلوب
  const style = document.createElement('style');
  style.innerHTML = `
    .cyber-chat-container {
      background-color: #0b131b;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 15px;
      font-family: system-ui, -apple-system, sans-serif;
      color: #e2e8f0;
      max-width: 500px;
      margin: 0 auto;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .cyber-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: monospace;
      font-size: 0.75rem;
      color: #64748b;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .cyber-chat-box {
      height: 420px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-right: 5px;
    }
    .msg-user {
      align-self: flex-end;
      background: #0f2b3c;
      border: 1px solid #00d9ff44;
      border-radius: 8px;
      padding: 10px 14px;
      max-width: 80%;
      text-align: right;
    }
    .msg-user .tag {
      color: #00d9ff;
      font-size: 0.7rem;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .msg-ai {
      align-self: flex-start;
      background: #0e1a24;
      border: 1px solid #00ffaa33;
      border-radius: 8px;
      padding: 10px 14px;
      max-width: 85%;
      position: relative;
    }
    .msg-ai .tag {
      color: #00ffaa;
      font-size: 0.7rem;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .copy-btn {
      margin-top: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid #1e293b;
      color: #94a3b8;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 0.7rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .copy-btn:hover {
      color: #00ffaa;
      border-color: #00ffaa55;
    }
  `;
  document.head.appendChild(style);

  // دالة نسخ نص الرسالة
  window.copyMsgText = function(btnElement) {
    const parent = btnElement.parentElement;
    const contentDiv = parent.querySelector('.msg-content');
    if (contentDiv) {
      const textToCopy = contentDiv.innerText.trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `✓ تم النسخ!`;
        btnElement.style.color = '#00ffaa';
        setTimeout(() => {
          btnElement.innerHTML = originalText;
          btnElement.style.color = '#94a3b8';
        }, 2000);
      });
    }
  };

  // دالة إرسال الرسالة وجلب الإجابة
  window.handleSendMessage = async function () {
    // جلب حقل النص وحاوية الرسائل أينما كانت في الواجهة
    const inputEl = document.querySelector('input[type="text"], textarea, #userInput, #modalChatInput, .cyber-input');
    const chatBoxEl = document.querySelector('#chat-box, #modalChatBox, .cyber-chat-box, .chat-messages');

    if (!inputEl || !chatBoxEl) return;
    
    const prompt = inputEl.value.trim();
    if (!prompt) return;

    // 1. إضافة سؤال المستخدم إلى الشاشة والذاكرة
    const userDiv = document.createElement("div");
    userDiv.className = "msg-user";
    userDiv.innerHTML = `<div class="tag">YOU</div><div class="msg-content">${prompt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    chatBoxEl.appendChild(userDiv);
    
    inputEl.value = "";
    chatHistory.push({ role: "user", content: prompt });

    // 2. مؤشر الانتظار
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "msg-ai";
    loadingDiv.innerHTML = `<div class="tag">GROQ_AI</div><div class="msg-content" style="color:#00ffaa;">⚡ جاري التفكير والرد...</div>`;
    chatBoxEl.appendChild(loadingDiv);
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;

    try {
      // إرسال الذاكرة الكاملة للسيرفر
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          model: "openai"
        })
      });

      loadingDiv.remove();

      if (response.ok) {
        const aiReply = await response.text();
        
        // حفظ رد الذكاء الاصطناعي في الذاكرة للسؤال القادم
        chatHistory.push({ role: "assistant", content: aiReply });

        const aiDiv = document.createElement("div");
        aiDiv.className = "msg-ai";
        aiDiv.innerHTML = `
          <div class="tag">GROQ_AI</div>
          <div class="msg-content" style="white-space: pre-wrap; line-height:1.5;">${aiReply}</div>
          <button class="copy-btn" onclick="copyMsgText(this)">📋 نسخ الرسالة</button>
        `;
        chatBoxEl.appendChild(aiDiv);
      } else {
        const errorDiv = document.createElement("div");
        errorDiv.className = "msg-ai";
        errorDiv.innerHTML = `<div class="tag">GROQ_AI</div><div>حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى.</div>`;
        chatBoxEl.appendChild(errorDiv);
      }
    } catch (err) {
      loadingDiv.remove();
      const errorDiv = document.createElement("div");
      errorDiv.className = "msg-ai";
      errorDiv.innerHTML = `<div class="tag">GROQ_AI</div><div>تعذر الاتصال بالسيرفر. تحقق من الاتصال بالإنترنت.</div>`;
      chatBoxEl.appendChild(errorDiv);
    }

    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
  };

  // ==========================================
  // التقاط حدث الضغط على أي زر إرسال أو مفتاح Enter
  // ==========================================
  document.addEventListener('click', (e) => {
    // البحث عما إذا كان العنصر المضغوط عليه زر إرسال أو يحتوي على كلمة إرسال
    const btn = e.target.closest('button, .send-btn, #sendBtn, #modalSendBtn, .cyber-send-btn');
    if (btn) {
      e.preventDefault();
      window.handleSendMessage();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        e.preventDefault();
        window.handleSendMessage();
      }
    }
  });

});

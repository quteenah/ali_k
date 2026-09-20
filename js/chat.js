document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const statusText = document.getElementById('status');

  // مفتاح Groq API
  const GROQ_API_KEY = "Gsk_0BOhUyYbSJd5jyIZUkW7WGdyb3FYHTypye1MygvzEiJEo7ZFsfab";

  async function handleSend() {
    if (!userInput) return;
    const text = userInput.value.trim();
    if (!text) return;

    // 1. تفريغ الخانة فوراً
    userInput.value = '';

    // 2. إظهار رسالة المستخدم فوراً
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user-msg';
    userDiv.innerHTML = `
      <div class="msg-author">YOU</div>
      <div class="msg-content">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    `;
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. إشعار الانتظار
    const aiDiv = document.createElement('div');
    aiDiv.className = 'msg ai-msg';
    aiDiv.innerHTML = `
      <div class="msg-author">GROQ_AI</div>
      <div class="msg-content">⚡ جاري الرد...</div>
    `;
    chatBox.appendChild(aiDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (statusText) statusText.innerText = 'STATUS: SENDING...';

    // 4. إرسال الطلب بسرعة فائقة
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: text }],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await res.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const reply = data.choices[0].message.content;
        aiDiv.querySelector('.msg-content').innerHTML = reply.replace(/\n/g, '<br>');
      } else {
        aiDiv.querySelector('.msg-content').innerText = 'خطأ في استجابة النظام.';
      }
    } catch (e) {
      aiDiv.querySelector('.msg-content').innerText = 'تأكد من الاتصال بالإنترنت.';
    }

    if (statusText) statusText.innerText = 'STATUS: READY';
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // ربط الأزرار بلمس الشاشات والتطبيقات اللمسية بسرعة
  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSend();
    });
  }

  if (userInput) {
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }
});

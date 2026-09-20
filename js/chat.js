const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('status');

// مفتاح Groq API
const GROQ_API_KEY = "Gsk_0BOhUyYbSJd5jyIZUkW7WGdyb3FYHTypye1MygvzEiJEo7ZFsfab";

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // 1. تفريغ مربع النص فوراً مثل محادثات Gemini
  userInput.value = '';

  // 2. إضافة رسالة المستخدم إلى الشات
  const userDiv = document.createElement('div');
  userDiv.className = 'msg user-msg';
  userDiv.innerHTML = `
    <div class="msg-author">YOU</div>
    <div class="msg-content">${escapeHTML(text)}</div>
  `;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  // 3. إنشاء العنصر الوهمي لرد الذكاء الاصطناعي مع مؤشر الانتظار
  const aiDiv = document.createElement('div');
  aiDiv.className = 'msg ai-msg';
  aiDiv.innerHTML = `
    <div class="msg-author">GROQ_AI</div>
    <div class="msg-content">جاري المعالجة...</div>
  `;
  chatBox.appendChild(aiDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (statusText) statusText.innerText = 'STATUS: PROCESSING...';

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await res.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      aiDiv.querySelector('.msg-content').innerHTML = reply.replace(/\n/g, '<br>');
    } else {
      aiDiv.querySelector('.msg-content').innerText = 'حدث خطأ في استجابة الخادم.';
    }
  } catch (e) {
    aiDiv.querySelector('.msg-content').innerText = 'تعذر الاتصال بالسيرفر. تحقق من الإنترنت.';
  }

  if (statusText) statusText.innerText = 'STATUS: READY';
  chatBox.scrollTop = chatBox.scrollHeight;
}

// حماية من ثغرات النص
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// أحداث الضغط
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

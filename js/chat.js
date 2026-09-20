const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('status');

// مفتاح Groq API الخاص بك
const GROQ_API_KEY = "Gsk_0BOhUyYbSJd5jyIZUkW7WGdyb3FYHTypye1MygvzEiJEo7ZFsfab";

sendBtn.addEventListener('click', async () => {
  const text = userInput.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div style="text-align:right; margin:8px 0;"><b>أنت:</b> ${text}</div>`;
  userInput.value = '';

  const aiDiv = document.createElement('div');
  aiDiv.style.textAlign = 'right';
  aiDiv.style.margin = '8px 0';
  aiDiv.style.color = '#333';
  aiDiv.innerHTML = `<b>الذكاء الاصطناعي:</b> جاري التفكير...`;
  chatBox.appendChild(aiDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

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
    if (data.choices && data.choices[0]) {
      const reply = data.choices[0].message.content;
      aiDiv.innerHTML = `<b>الذكاء الاصطناعي:</b> ${reply.replace(/\n/g, '<br>')}`;
    } else {
      aiDiv.innerHTML = `<b>الذكاء الاصطناعي:</b> حدث خطأ في استجابة الخادم.`;
    }
  } catch (e) {
    aiDiv.innerHTML = `<b>الذكاء الاصطناعي:</b> تعذر الاتصال بالسيرفر.`;
  }
  chatBox.scrollTop = chatBox.scrollHeight;
});

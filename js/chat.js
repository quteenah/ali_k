import * as webllm from "https://esm.run/@mlc-ai/web-llm";

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('status');

let engine;
const model = "Llama-3-8B-Instruct-q4f16_1-MLC";

async function initChat() {
  statusText.innerText = "جاري تهيئة نموذج الذكاء الاصطناعي...";
  engine = await webllm.CreateMLCEngine(model, {
    initProgressCallback: (r) => statusText.innerText = r.text
  });
  statusText.innerText = "الشات جاهز للاستخدام!";
}

sendBtn.addEventListener('click', async () => {
  const text = userInput.value.trim();
  if (!text) return;

  if (!engine) await initChat();

  chatBox.innerHTML += `<div><b>أنت:</b> ${text}</div>`;
  userInput.value = '';

  const aiDiv = document.createElement('div');
  aiDiv.innerHTML = `<b>الذكاء الاصطناعي:</b> جاري التفكير...`;
  chatBox.appendChild(aiDiv);

  const chunks = await engine.chat.completions.create({
    messages: [{ role: "user", content: text }],
    stream: true,
  });

  let reply = "";
  for await (const chunk of chunks) {
    reply += chunk.choices[0]?.delta?.content || "";
    aiDiv.innerHTML = `<b>الذكاء الاصطناعي:</b> ${reply}`;
  }
});

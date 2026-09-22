// ==========================================
// أداة توليد الصور بالذكاء الاصطناعي - عرض الصورة المباشر
// ==========================================

window.openImageGeneratorService = function () {
  const generatorHtml = `
    <div style="display: flex; flex-direction: column; gap: 14px; padding: 5px; text-align: right;">
      
      <p style="font-size: 0.85rem; color: var(--text-secondary, #94a3b8); margin: 0; text-align: center;">
        اكتب وصف الصورة باللغة العربية أو الإنجليزية وسيتم رسمها وعرضها فوراً:
      </p>

      <!-- حقل إدخال الوصف -->
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label style="font-size: 0.82rem; font-weight: bold; color: #fff;">📝 وصف الصورة (Prompt):</label>
        <textarea 
          id="aiPromptInput" 
          rows="3" 
          placeholder="مثال: فتاة جميلة لديها قطة..."
          style="
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #1e293b;
            background: #04080c;
            color: #fff;
            font-size: 0.88rem;
            resize: vertical;
            outline: none;
            box-sizing: border-box;
          "
        ></textarea>
      </div>

      <!-- إعدادات النمط والأبعاد -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        
        <!-- اختيار النمط -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 0.8rem; color: #cbd5e1;">🎨 النمط (Style):</label>
          <select id="aiStyleSelect" style="padding: 8px; border-radius: 6px; border: 1px solid #1e293b; background: #090d16; color: #00d9ff; font-size: 0.8rem; outline: none;">
            <option value="">تلقائي (Default)</option>
            <option value="photorealistic, 8k, highly detailed, professional photography">واقعي (Realistic)</option>
            <option value="anime style, studio ghibli, vibrant colors, digital art">أنمي (Anime)</option>
            <option value="cyberpunk style, neon lights, highly detailed, futuristic">سايبربانك (Cyberpunk)</option>
            <option value="3D render, Pixar style, cute, smooth lighting">مجسم (3D / Pixar)</option>
            <option value="oil painting, masterpiece, artistic, detailed brushwork">لوحة زيتية (Oil Paint)</option>
          </select>
        </div>

        <!-- اختيار الأبعاد -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <label style="font-size: 0.8rem; color: #cbd5e1;">📐 الأبعاد (Size):</label>
          <select id="aiSizeSelect" style="padding: 8px; border-radius: 6px; border: 1px solid #1e293b; background: #090d16; color: #00d9ff; font-size: 0.8rem; outline: none;">
            <option value="1024x1024">مربع (1024x1024)</option>
            <option value="1280x720">عرضي (1280x720 - 16:9)</option>
            <option value="720x1280">طولي / ستوري (720x1280 - 9:16)</option>
          </select>
        </div>

      </div>

      <!-- زر التوليد -->
      <button 
        id="startGenerateBtn"
        onclick="generateAiImage()" 
        style="
          width: 100%; 
          padding: 12px; 
          background: linear-gradient(135deg, #a855f7, #6366f1); 
          color: #fff; 
          font-weight: bold; 
          border: none; 
          border-radius: 10px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px;
          font-size: 0.95rem;
          margin-top: 4px;
        "
      >
        <i class="fa-solid fa-wand-magic-sparkles"></i> توليد الصورة الآن
      </button>

      <!-- حالة المعالجة -->
      <div id="aiStatus" style="display: none; font-size: 0.85rem; padding: 6px; text-align: center;"></div>

      <!-- حاوية عرض الصورة الناتجة بشكل مرئي -->
      <div id="aiResultContainer" style="display: none; flex-direction: column; align-items: center; gap: 10px; margin-top: 8px;">
        <div style="position: relative; width: 100%; min-height: 250px; max-height: 380px; border-radius: 10px; border: 1px solid #1e293b; background: #000; display: flex; justify-content: center; align-items: center; overflow: hidden;">
          <!-- عنصر الصورة المرئي -->
          <img id="aiOutputImg" src="" alt="الصورة المولدة" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px;" />
        </div>

        <!-- أزرار حفظ وتحميل الصورة -->
        <div style="display: flex; width: 100%; gap: 8px;">
          <a id="downloadAiImgBtn" href="#" download="ai-generated-image.jpg" target="_blank" style="flex: 1; text-align: center; padding: 10px; background: #00ffaa; color: #000; font-weight: bold; border-radius: 6px; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fa-solid fa-download"></i> تحميل الصورة
          </a>
        </div>
      </div>

    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("✨ توليد الصور بالذكاء الاصطناعي", generatorHtml, false);
  }
};

window.generateAiImage = async function () {
  const promptInput = document.getElementById("aiPromptInput");
  const styleSelect = document.getElementById("aiStyleSelect");
  const sizeSelect = document.getElementById("aiSizeSelect");
  const status = document.getElementById("aiStatus");
  const resultContainer = document.getElementById("aiResultContainer");
  const outputImg = document.getElementById("aiOutputImg");
  const downloadBtn = document.getElementById("downloadAiImgBtn");
  const btn = document.getElementById("startGenerateBtn");

  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("يرجى كتابة وصف للصورة أولاً!");
    return;
  }

  const [width, height] = sizeSelect.value.split("x").map(Number);
  const style = styleSelect.value;

  status.style.display = "block";
  status.style.color = "#a855f7";
  status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري رسم الصورة بالذكاء الاصطناعي...`;

  btn.disabled = true;
  btn.style.opacity = "0.6";
  resultContainer.style.display = "none";

  try {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style, width, height })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "تعذر معالجة الطلب");
    }

    // إسناد قيمة الصورة المولدة كـ Data URL أو رابط مباشر لتعرض فوراً داخل عنصر img
    outputImg.src = data.imageUrl;
    downloadBtn.href = data.imageUrl;

    status.style.color = "#00ffaa";
    status.innerHTML = `✅ تم توليد الصورة بنجاح!`;
    resultContainer.style.display = "flex";

  } catch (e) {
    status.style.color = "#ff4d4d";
    status.innerHTML = `❌ ${e.message}`;
  } finally {
    btn.disabled = false;
    btn.style.opacity = "1";
  }
};
 

// ==========================================
// ✨ مولد الصور بالذكاء الاصطناعي
// Ali-K AI Image Generator
// ==========================================

window.openImageGeneratorService = function () {

  const generatorHtml = `
    <div style="
      display:flex;
      flex-direction:column;
      gap:14px;
      padding:5px;
      text-align:right;
    ">

      <!-- الوصف -->
      <p style="
        font-size:.85rem;
        color:var(--text-secondary,#94a3b8);
        margin:0;
        text-align:center;
        line-height:1.8;
      ">
        اكتب وصف الصورة بالعربية أو الإنجليزية وسيتم توليدها وعرضها مباشرة.
      </p>

      <!-- Prompt -->
      <div style="
        display:flex;
        flex-direction:column;
        gap:7px;
      ">

        <label style="
          font-size:.85rem;
          font-weight:bold;
          color:#fff;
        ">
          📝 وصف الصورة:
        </label>

        <textarea
          id="aiPromptInput"
          rows="4"
          placeholder="مثال: فتاة جميلة تجلس بجانب قطة بيضاء في حديقة جميلة وقت الغروب..."
          style="
            width:100%;
            padding:12px;
            border-radius:10px;
            border:1px solid #26344f;
            background:#03070c;
            color:#fff;
            font-size:.9rem;
            line-height:1.7;
            resize:vertical;
            outline:none;
            box-sizing:border-box;
          "
        ></textarea>

      </div>

      <!-- الإعدادات -->
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      ">

        <!-- النمط -->
        <div style="
          display:flex;
          flex-direction:column;
          gap:5px;
        ">

          <label style="
            font-size:.8rem;
            color:#cbd5e1;
          ">
            🎨 النمط:
          </label>

          <select
            id="aiStyleSelect"
            style="
              width:100%;
              padding:10px;
              border-radius:8px;
              border:1px solid #26344f;
              background:#090d16;
              color:#00d9ff;
              font-size:.78rem;
              outline:none;
              box-sizing:border-box;
            "
          >

            <option value="">
              تلقائي
            </option>

            <option value="photorealistic, professional photography, highly detailed, realistic lighting">
              📷 واقعي
            </option>

            <option value="anime style, beautiful anime artwork, vibrant colors, detailed digital art">
              🎌 أنمي
            </option>

            <option value="cyberpunk, neon lights, futuristic city, cinematic lighting, highly detailed">
              ⚡ سايبربانك
            </option>

            <option value="3D render, cute 3D character, smooth lighting, high quality">
              🧊 3D
            </option>

            <option value="oil painting, artistic masterpiece, detailed brushwork, classical painting">
              🎨 لوحة زيتية
            </option>

            <option value="cinematic photography, dramatic lighting, movie scene, ultra detailed">
              🎬 سينمائي
            </option>

            <option value="fantasy art, magical atmosphere, epic environment, highly detailed">
              🐉 خيالي
            </option>

          </select>

        </div>

        <!-- الحجم -->
        <div style="
          display:flex;
          flex-direction:column;
          gap:5px;
        ">

          <label style="
            font-size:.8rem;
            color:#cbd5e1;
          ">
            📐 الأبعاد:
          </label>

          <select
            id="aiSizeSelect"
            style="
              width:100%;
              padding:10px;
              border-radius:8px;
              border:1px solid #26344f;
              background:#090d16;
              color:#00d9ff;
              font-size:.78rem;
              outline:none;
              box-sizing:border-box;
            "
          >

            <option value="1024x1024">
              مربع 1:1
            </option>

            <option value="1280x720">
              عرضي 16:9
            </option>

            <option value="720x1280">
              طولي 9:16
            </option>

            <option value="1024x1536">
              بورتريه
            </option>

          </select>

        </div>

      </div>

      <!-- زر التوليد -->
      <button
        id="startGenerateBtn"
        onclick="generateAiImage()"
        style="
          width:100%;
          padding:14px;
          background:linear-gradient(
            135deg,
            #a855f7,
            #6366f1
          );
          color:#fff;
          font-weight:bold;
          border:none;
          border-radius:12px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          font-size:.95rem;
          margin-top:4px;
          box-shadow:0 8px 25px rgba(99,102,241,.25);
        "
      >

        <i class="fa-solid fa-wand-magic-sparkles"></i>

        توليد الصورة الآن

      </button>

      <!-- الحالة -->
      <div
        id="aiStatus"
        style="
          display:none;
          font-size:.85rem;
          padding:8px;
          text-align:center;
          line-height:1.7;
        "
      ></div>

      <!-- النتيجة -->
      <div
        id="aiResultContainer"
        style="
          display:none;
          flex-direction:column;
          align-items:center;
          gap:10px;
          margin-top:8px;
        "
      >

        <div style="
          position:relative;
          width:100%;
          min-height:280px;
          max-height:500px;
          border-radius:12px;
          border:1px solid #26344f;
          background:#000;
          display:flex;
          justify-content:center;
          align-items:center;
          overflow:hidden;
        ">

          <img
            id="aiOutputImg"
            src=""
            alt="الصورة المولدة بالذكاء الاصطناعي"
            style="
              width:100%;
              max-height:500px;
              object-fit:contain;
              display:block;
              border-radius:12px;
            "
          />

        </div>

        <!-- معلومات -->
        <div
          id="aiImageInfo"
          style="
            width:100%;
            text-align:center;
            font-size:.75rem;
            color:#94a3b8;
          "
        ></div>

        <!-- تحميل -->
        <a
          id="downloadAiImgBtn"
          href="#"
          download="ali-k-ai-image.jpg"
          target="_blank"
          style="
            width:100%;
            box-sizing:border-box;
            text-align:center;
            padding:12px;
            background:#00ffaa;
            color:#000;
            font-weight:bold;
            border-radius:8px;
            text-decoration:none;
            font-size:.85rem;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:7px;
          "
        >

          <i class="fa-solid fa-download"></i>

          تحميل الصورة

        </a>

      </div>

    </div>
  `;

  if (window.openServiceModal) {

    window.openServiceModal(
      "✨ توليد الصور بالذكاء الاصطناعي",
      generatorHtml,
      false
    );

  } else {

    console.error("openServiceModal غير موجود");

  }
};


// ==========================================
// توليد الصورة
// ==========================================

window.generateAiImage = async function () {

  const promptInput =
    document.getElementById("aiPromptInput");

  const styleSelect =
    document.getElementById("aiStyleSelect");

  const sizeSelect =
    document.getElementById("aiSizeSelect");

  const status =
    document.getElementById("aiStatus");

  const resultContainer =
    document.getElementById("aiResultContainer");

  const outputImg =
    document.getElementById("aiOutputImg");

  const downloadBtn =
    document.getElementById("downloadAiImgBtn");

  const imageInfo =
    document.getElementById("aiImageInfo");

  const btn =
    document.getElementById("startGenerateBtn");


  // التأكد من وجود العناصر
  if (
    !promptInput ||
    !styleSelect ||
    !sizeSelect ||
    !status ||
    !resultContainer ||
    !outputImg ||
    !downloadBtn ||
    !btn
  ) {

    console.error("عناصر مولد الصور غير موجودة");

    return;

  }


  const prompt =
    promptInput.value.trim();


  if (!prompt) {

    status.style.display = "block";
    status.style.color = "#ff4d4d";
    status.innerHTML =
      "⚠️ يرجى كتابة وصف الصورة أولاً.";

    return;

  }


  // استخراج الحجم
  const parts =
    sizeSelect.value.split("x");

  const width =
    Number(parts[0]) || 1024;

  const height =
    Number(parts[1]) || 1024;


  const style =
    styleSelect.value || "";


  // حالة التحميل
  status.style.display = "block";

  status.style.color = "#a855f7";

  status.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    جاري توليد الصورة...
    <br>
    <small style="color:#94a3b8;">
      قد تستغرق العملية بعض الوقت
    </small>
  `;


  // تعطيل الزر
  btn.disabled = true;

  btn.style.opacity = "0.55";

  btn.style.cursor = "wait";


  // إخفاء النتيجة السابقة
  resultContainer.style.display = "none";

  outputImg.src = "";


  try {

    const response =
      await fetch("/api/generate-image", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          prompt: prompt,

          style: style,

          width: width,

          height: height

        })

      });


    let data;

    try {

      data = await response.json();

    } catch {

      throw new Error(
        "الخادم أعاد استجابة غير صالحة."
      );

    }


    if (!response.ok || !data.success) {

      throw new Error(
        data.error ||
        `خطأ في الخادم (${response.status})`
      );

    }


    if (!data.imageUrl) {

      throw new Error(
        "لم يتم إرجاع رابط الصورة."
      );

    }


    // عرض الصورة
    outputImg.src =
      data.imageUrl;


    // تحديث رابط التحميل
    downloadBtn.href =
      data.imageUrl;


    // اسم الملف
    downloadBtn.download =
      `ali-k-ai-${Date.now()}.jpg`;


    // معلومات الصورة
    if (imageInfo) {

      imageInfo.innerHTML = `
        ✨ تم توليد الصورة بنجاح
        <br>
        ${width} × ${height}
      `;

    }


    // نجاح
    status.style.color =
      "#00ffaa";

    status.innerHTML =
      "✅ تم توليد الصورة بنجاح!";


    resultContainer.style.display =
      "flex";


    // التمرير إلى النتيجة
    setTimeout(() => {

      resultContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 150);


  } catch (error) {

    console.error(
      "AI IMAGE ERROR:",
      error
    );


    status.style.display =
      "block";

    status.style.color =
      "#ff4d4d";


    status.innerHTML = `
      ❌ ${escapeAiError(error.message)}
    `;


  } finally {

    btn.disabled = false;

    btn.style.opacity = "1";

    btn.style.cursor = "pointer";

  }

};


// ==========================================
// حماية رسالة الخطأ
// ==========================================

function escapeAiError(text) {

  return String(text || "حدث خطأ غير معروف")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

      }

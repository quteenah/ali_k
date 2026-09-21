// ==========================================
// أداة تحويل النصوص والصور إلى PDF (PDF Maker)
// ==========================================

function openPdfMakerService() {
  const modal = document.getElementById("modalContainer");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!modal || !title || !body) return;

  title.innerHTML = '<i class="fa-solid fa-file-pdf" style="color: #ff4757;"></i> صانع ملفات PDF';

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 15px; font-family: system-ui, sans-serif; color: #fff;">
      
      <!-- أزرار التبديل بين الصور والنصوص -->
      <div style="display: flex; background: #0f172a; padding: 4px; border-radius: 8px; border: 1px solid #1e293b;">
        <button id="pdfTabImg" onclick="switchPdfTab('images')" style="flex: 1; padding: 8px; border: none; background: #ff4757; color: #fff; font-weight: bold; border-radius: 6px; cursor: pointer;">
          <i class="fa-solid fa-images"></i> تحويل صور إلى PDF
        </button>
        <button id="pdfTabText" onclick="switchPdfTab('text')" style="flex: 1; padding: 8px; border: none; background: transparent; color: #fff; font-weight: bold; border-radius: 6px; cursor: pointer;">
          <i class="fa-solid fa-align-right"></i> تحويل نص إلى PDF
        </button>
      </div>

      <!-- قسم تحويل الصور إلى PDF -->
      <div id="pdfImgSection" style="display: flex; flex-direction: column; gap: 12px;">
        <label style="text-align: center; background: #0f172a; border: 1px dashed #ff4757; padding: 15px; border-radius: 8px; cursor: pointer; color: #94a3b8; font-size: 0.85rem;">
          <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.5rem; color: #ff4757; display: block; margin-bottom: 6px;"></i>
          اختر صورة أو مجموعة صور من الذاكرة
          <input type="file" id="pdfImageFiles" accept="image/*" multiple onchange="previewPdfImages(this)" style="display: none;">
        </label>

        <!-- منطقة معاينة الصور المحددة -->
        <div id="pdfImagesPreview" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-height: 180px; overflow-y: auto; padding: 4px;"></div>

        <button onclick="convertImagesToPdf()" style="background: #ff4757; color: #fff; font-weight: bold; padding: 10px; border: none; border-radius: 8px; cursor: pointer; margin-top: 5px;">
          <i class="fa-solid fa-file-export"></i> إنشاء ملف PDF من الصور
        </button>
      </div>

      <!-- قسم تحويل النص إلى PDF -->
      <div id="pdfTextSection" style="display: none; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 6px;">اكتب أو ألصق النص هنا (يدعم اللغة العربية):</label>
          <textarea id="pdfInputText" placeholder="اكتب النص الذي ترغب بتحويله إلى مستند PDF..." style="width: 100%; height: 120px; padding: 10px; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box; resize: vertical; direction: rtl; text-align: right;"></textarea>
        </div>

        <button onclick="convertTextToPdf()" style="background: #ff4757; color: #fff; font-weight: bold; padding: 10px; border: none; border-radius: 8px; cursor: pointer;">
          <i class="fa-solid fa-file-export"></i> إنشاء ملف PDF من النص
        </button>
      </div>

      <!-- حالة المعالجة -->
      <div id="pdfStatus" style="display: none; text-align: center; color: #00d9ff; font-size: 0.85rem; margin-top: 5px;"></div>

    </div>
  `;

  modal.style.display = "flex";
}

let selectedPdfImages = [];

// التبديل بين الأقسام
function switchPdfTab(tab) {
  const imgSec = document.getElementById("pdfImgSection");
  const textSec = document.getElementById("pdfTextSection");
  const imgBtn = document.getElementById("pdfTabImg");
  const textBtn = document.getElementById("pdfTabText");

  if (tab === 'images') {
    imgSec.style.display = "flex";
    textSec.style.display = "none";
    imgBtn.style.background = "#ff4757";
    textBtn.style.background = "transparent";
  } else {
    imgSec.style.display = "none";
    textSec.style.display = "flex";
    textBtn.style.background = "#ff4757";
    imgBtn.style.background = "transparent";
  }
}

// معاينة الصور المختارة
function previewPdfImages(input) {
  const previewContainer = document.getElementById("pdfImagesPreview");
  previewContainer.innerHTML = "";
  selectedPdfImages = Array.from(input.files);

  if (selectedPdfImages.length === 0) return;

  selectedPdfImages.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.cssText = "width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #1e293b;";
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// تحويل الصور إلى PDF
async function convertImagesToPdf() {
  const status = document.getElementById("pdfStatus");
  if (!selectedPdfImages || selectedPdfImages.length === 0) {
    alert("يرجى اختيار صورة واحدة على الأقل!");
    return;
  }

  status.style.display = "block";
  status.innerText = "⚡ جاري إنشاء ملف PDF من الصور...";

  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  for (let i = 0; i < selectedPdfImages.length; i++) {
    const file = selectedPdfImages[i];
    const dataUrl = await fileToDataURL(file);
    const imgProps = doc.getImageProperties(dataUrl);
    
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    const width = imgProps.width * ratio;
    const height = imgProps.height * ratio;
    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    if (i > 0) doc.addPage();
    doc.addImage(dataUrl, 'JPEG', x, y, width, height);
  }

  doc.save("converted_images.pdf");
  status.innerText = "✅ تم تحميل ملف PDF بنجاح!";
}

// تحويل النص العربي إلى PDF بوضوح تبياني عالي
async function convertTextToPdf() {
  const text = document.getElementById("pdfInputText").value.trim();
  const status = document.getElementById("pdfStatus");

  if (!text) {
    alert("يرجى كتابة نص أولاً!");
    return;
  }

  status.style.display = "block";
  status.innerText = "⚡ جاري معالجة النص العربي وإنشاء الـ PDF...";

  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const { jsPDF } = window.jspdf;

  // إنشاء canvas مؤقت بريزولوشن عالي لرسم النص العربي
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const canvasWidth = 1200;
  const padding = 60;
  const fontSize = 28;
  const lineHeight = 42;

  // تقسيم النص إلى أسطر متناسبة مع العرض
  ctx.font = `${fontSize}px sans-serif, 'Segoe UI', Tahoma, Geneva, Verdana`;
  const paragraphs = text.split("\n");
  let lines = [];

  paragraphs.forEach(para => {
    const words = para.split(" ");
    let currentLine = "";

    words.forEach(word => {
      let testLine = currentLine ? currentLine + " " + word : word;
      let metrics = ctx.measureText(testLine);
      if (metrics.width > (canvasWidth - padding * 2) && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
  });

  // حساب ارتفاع الكانفاس المطلوب
  const canvasHeight = Math.max(1600, lines.length * lineHeight + padding * 2);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // إعادة خلفية بيضاء ورسم النص العربي بتجاه RTL
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000000";
  ctx.font = `${fontSize}px sans-serif, 'Segoe UI', Tahoma, Geneva, Verdana`;
  ctx.direction = "rtl";
  ctx.textAlign = "right";

  let y = padding + fontSize;
  lines.forEach(line => {
    ctx.fillText(line, canvasWidth - padding, y);
    y += lineHeight;
  });

  // تحويل الكانفاس إلى صورة واستخراج PDF منها
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const doc = new jsPDF("p", "pt", "a4");

  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = doc.internal.pageSize.getHeight();

  const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

  let heightLeft = imgHeight;
  let position = 0;

  doc.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    doc.addPage();
    doc.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  doc.save("arabic_document.pdf");
  status.innerText = "✅ تم إنشاء وتحميل مستند PDF العربي بنجاح!";
}

// دالة مساعدة لتحويل الملف إلى DataURL
function fileToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// دالة تحميل المكتبات الخارجية
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
 

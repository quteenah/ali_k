// ==========================================
// أداة تحويل ملفات PDF إلى صور JPG (PDF to JPG Converter)
// ==========================================

function openPdfToJpgService() {
  const modal = document.getElementById("modalContainer");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!modal || !title || !body) return;

  title.innerHTML = '<i class="fa-solid fa-file-pdf" style="color: #ff4757;"></i> تحويل PDF إلى صور JPG';

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; font-family: system-ui, sans-serif; color: #fff;">
      
      <!-- اختيار ملف الـ PDF -->
      <div>
        <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 6px;">اختر ملف PDF من جهازك:</label>
        <input type="file" id="pdfFileInput" accept="application/pdf" style="width: 100%; padding: 8px; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; color: #fff; outline: none; font-size: 0.85rem;">
      </div>

      <!-- زر التحويل -->
      <button onclick="convertPdfToJpg()" style="background: linear-gradient(135deg, #ff4757, #ff6b81); color: #fff; font-weight: bold; padding: 12px; border: none; border-radius: 8px; cursor: pointer; margin-top: 5px;">
        <i class="fa-solid fa-wand-magic-sparkles"></i> تحويل الصفحات إلى صور
      </button>

      <!-- منطقة عرض النتيجة والتقدم -->
      <div id="pdfResult" style="margin-top: 10px; text-align: center; display: none;">
        <div id="pdfStatus" style="color: #00d9ff; font-size: 0.9rem; margin-bottom: 10px;">⚡ جاري معالجة المستند...</div>
        
        <div id="pdfImagesContainer" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-height: 300px; overflow-y: auto; padding: 10px; background: #0b1329; border-radius: 8px; border: 1px solid #1e293b;">
          <!-- يتم عرض المعاينات هنا -->
        </div>

        <button id="pdfDownloadZipBtn" onclick="downloadAllPdfImagesZip()" style="display: none; margin: 15px auto 0 auto; background: #2ed573; color: #fff; font-weight: bold; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">
          📦 تحميل جميع الصور (ملف ZIP)
        </button>
      </div>

    </div>
  `;

  modal.style.display = "flex";
}

let generatedJpgBlobs = [];

async function convertPdfToJpg() {
  const fileInput = document.getElementById("pdfFileInput");
  const resultDiv = document.getElementById("pdfResult");
  const statusEl = document.getElementById("pdfStatus");
  const container = document.getElementById("pdfImagesContainer");
  const zipBtn = document.getElementById("pdfDownloadZipBtn");

  if (!fileInput.files || !fileInput.files[0]) {
    alert("يرجى اختيار ملف PDF أولاً!");
    return;
  }

  const file = fileInput.files[0];
  generatedJpgBlobs = [];
  container.innerHTML = "";
  resultDiv.style.display = "block";
  statusEl.style.display = "block";
  zipBtn.style.display = "none";

  // تحميل مكتبات pdf.js ديناميكياً إن لم تكن متوفرة
  if (!window.pdfjsLib) {
    statusEl.innerText = "⚡ جاري تحميل مكتبة معالجة الـ PDF...";
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
      statusEl.innerText = `⚡ جاري معالجة الصفحة (${i} من ${totalPages})...`;

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // جودة عالية HD

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      // تحويل الكانفاس إلى صورة Blob بصيغة JPEG
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      const imageUrl = URL.createObjectURL(blob);

      generatedJpgBlobs.push({ pageNum: i, blob: blob });

      // إضافة عنصر المعاينة للواجهة
      const card = document.createElement("div");
      card.style.cssText = "width: 120px; background: #1e293b; border-radius: 6px; padding: 6px; text-align: center;";
      card.innerHTML = `
        <img src="${imageUrl}" style="width: 100%; border-radius: 4px; display: block; margin-bottom: 4px;">
        <span style="font-size: 0.75rem; color: #94a3b8;">صفحة ${i}</span>
        <a href="${imageUrl}" download="page_${i}.jpg" style="display: block; font-size: 0.7rem; color: #00d9ff; text-decoration: none; margin-top: 2px;">📥 تحميل</a>
      `;
      container.appendChild(card);
    }

    statusEl.innerText = `✅ اكتمل التحويل بنجاح! تم استخراج ${totalPages} صفحة.`;
    if (totalPages > 1) {
      zipBtn.style.display = "block";
    }

  } catch (error) {
    statusEl.innerText = "❌ حدث خطأ أثناء معالجة الملف: " + error.message;
  }
}

// دالة تجميع الصور وضغطها في ملف ZIP للتحميل دفعة واحدة
async function downloadAllPdfImagesZip() {
  if (!generatedJpgBlobs.length) return;

  if (!window.JSZip) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  }

  const zip = new JSZip();
  generatedJpgBlobs.forEach((item) => {
    zip.file(`page_${item.pageNum}.jpg`, item.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  const zipUrl = URL.createObjectURL(content);

  const a = document.createElement("a");
  a.href = zipUrl;
  a.download = "pdf_pages.zip";
  a.click();
}

// دالة مساعدة لتحميل السكربتات الخارجية
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

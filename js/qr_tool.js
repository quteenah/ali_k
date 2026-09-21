// ==========================================
// أداة صانع وقارئ رموز QR (QR Code Tool)
// ==========================================

let qrStream = null; // للحفاظ على مسار بث الكاميرا الحية
let qrVideoInterval = null;

function openQrToolService() {
  const modal = document.getElementById("modalContainer");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!modal || !title || !body) return;

  title.innerHTML = '<i class="fa-solid fa-qrcode" style="color: #00d9ff;"></i> صانع وقارئ رموز QR';

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 15px; font-family: system-ui, sans-serif; color: #fff;">
      
      <!-- أزرار التبديل بين التوليد والقراءة -->
      <div style="display: flex; background: #0f172a; padding: 4px; border-radius: 8px; border: 1px solid #1e293b;">
        <button id="qrTabGen" onclick="switchQrTab('gen')" style="flex: 1; padding: 8px; border: none; background: #00d9ff; color: #000; font-weight: bold; border-radius: 6px; cursor: pointer;">
          <i class="fa-solid fa-plus"></i> إنشـاء QR
        </button>
        <button id="qrTabScan" onclick="switchQrTab('scan')" style="flex: 1; padding: 8px; border: none; background: transparent; color: #fff; font-weight: bold; border-radius: 6px; cursor: pointer;">
          <i class="fa-solid fa-camera"></i> قـراءة QR
        </button>
      </div>

      <!-- قسم إنشاء رمز QR -->
      <div id="qrGenSection" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 0.85rem; color: #94a3b8; display: block; margin-bottom: 6px;">أدخل النص أو الرابط:</label>
          <input type="text" id="qrInputText" placeholder="https://example.com أو أي نص..." style="width: 100%; padding: 10px; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
        </div>

        <button onclick="generateQrCode()" style="background: #00d9ff; color: #000; font-weight: bold; padding: 10px; border: none; border-radius: 8px; cursor: pointer;">
          توليد الرمز
        </button>

        <div id="qrGenResult" style="text-align: center; display: none; margin-top: 10px;">
          <div id="qrCanvasBox" style="background: #fff; padding: 12px; display: inline-block; border-radius: 8px;"></div>
          <br>
          <a id="qrDownloadBtn" href="" download="qrcode.png" style="display: inline-block; margin-top: 10px; background: #2ed573; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: bold;">
            📥 تحميل الرمز
          </a>
        </div>
      </div>

      <!-- قسم قراءة رمز QR -->
      <div id="qrScanSection" style="display: none; flex-direction: column; gap: 12px;">
        
        <!-- خيارات إدخال الصورة (من المعرض أو الكاميرا) -->
        <div style="display: flex; gap: 10px;">
          <!-- رفع ملف من الذاكرة/المعرض بدون فتح الكاميرا تلقائياً -->
          <label style="flex: 1; text-align: center; background: #0f172a; border: 1px solid #1e293b; padding: 10px; border-radius: 8px; cursor: pointer; color: #94a3b8; font-size: 0.85rem; font-weight: bold;">
            <i class="fa-solid fa-folder-open" style="color: #00d9ff;"></i> رفع من المعرض
            <input type="file" id="qrFileInput" accept="image/*" onchange="scanQrFromImage(this)" style="display: none;">
          </label>

          <!-- زر تشغيل الكاميرا الحية -->
          <button onclick="startLiveCameraScan()" style="flex: 1; background: #0f172a; border: 1px solid #1e293b; padding: 10px; border-radius: 8px; cursor: pointer; color: #94a3b8; font-size: 0.85rem; font-weight: bold;">
            <i class="fa-solid fa-camera" style="color: #2ed573;"></i> فتح الكاميرا
          </button>
        </div>

        <!-- منطقة شاشة عرض الكاميرا الحية -->
        <div id="qrCameraContainer" style="display: none; position: relative; text-align: center; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid #00d9ff;">
          <video id="qrVideo" style="width: 100%; max-height: 250px; object-fit: cover;"></video>
          <button onclick="stopLiveCamera()" style="position: absolute; top: 8px; right: 8px; background: rgba(255, 71, 87, 0.8); color: #fff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">إغلاق الكاميرا</button>
        </div>

        <!-- منطقة عرض وقراءة النتيجة -->
        <div id="qrScanResult" style="display: none; background: #0b1329; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
          <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">النتيجة المستخرجة:</div>
          <div id="qrScanText" style="word-break: break-all; color: #00d9ff; font-weight: bold; font-size: 0.95rem;"></div>
          <button onclick="copyQrText()" style="margin-top: 10px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;">
            📋 نسخ النص
          </button>
        </div>

      </div>

    </div>
  `;

  modal.style.display = "flex";
}

// التبديل بين التبويبات
function switchQrTab(tab) {
  const genSec = document.getElementById("qrGenSection");
  const scanSec = document.getElementById("qrScanSection");
  const genBtn = document.getElementById("qrTabGen");
  const scanBtn = document.getElementById("qrTabScan");

  stopLiveCamera(); // إيقاف الكاميرا عند التنقل

  if (tab === 'gen') {
    genSec.style.display = "flex";
    scanSec.style.display = "none";
    genBtn.style.background = "#00d9ff";
    genBtn.style.color = "#000";
    scanBtn.style.background = "transparent";
    scanBtn.style.color = "#fff";
  } else {
    genSec.style.display = "none";
    scanSec.style.display = "flex";
    scanBtn.style.background = "#00d9ff";
    scanBtn.style.color = "#000";
    genBtn.style.background = "transparent";
    genBtn.style.color = "#fff";
  }
}

// دالة تحميل مكتبات برمجية خارجيّة عند الحاجة
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

// إنشاء رمز QR
async function generateQrCode() {
  const text = document.getElementById("qrInputText").value.trim();
  const resultDiv = document.getElementById("qrGenResult");
  const canvasBox = document.getElementById("qrCanvasBox");
  const downloadBtn = document.getElementById("qrDownloadBtn");

  if (!text) {
    alert("يرجى إدخال نص أو رابط أولاً!");
    return;
  }

  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js");

  canvasBox.innerHTML = "";
  resultDiv.style.display = "block";

  new QRCode(canvasBox, {
    text: text,
    width: 180,
    height: 180,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const img = canvasBox.querySelector("img");
    const canvas = canvasBox.querySelector("canvas");
    if (img && img.src) {
      downloadBtn.href = img.src;
    } else if (canvas) {
      downloadBtn.href = canvas.toDataURL("image/png");
    }
  }, 300);
}

// قراءة رمز QR من المعرض/الذاكرة
async function scanQrFromImage(input) {
  const file = input.files[0];
  const resultDiv = document.getElementById("qrScanResult");
  const textDiv = document.getElementById("qrScanText");

  if (!file) return;
  stopLiveCamera();

  await loadScript("https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js");

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      resultDiv.style.display = "block";

      if (code) {
        textDiv.innerText = code.data;
      } else {
        textDiv.innerText = "❌ لم يتم العثور على رمز QR صالح في الصورة المحددة.";
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// فتح وتشغيل الكاميرا الحية لقرائة QR مباشر
async function startLiveCameraScan() {
  const cameraContainer = document.getElementById("qrCameraContainer");
  const video = document.getElementById("qrVideo");
  const resultDiv = document.getElementById("qrScanResult");
  const textDiv = document.getElementById("qrScanText");

  await loadScript("https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js");

  try {
    qrStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = qrStream;
    video.setAttribute("playsinline", true);
    video.play();
    cameraContainer.style.display = "block";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    qrVideoInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          resultDiv.style.display = "block";
          textDiv.innerText = code.data;
          stopLiveCamera(); // إيقاف الكاميرا بعد القراءة المباشرة بنجاح
        }
      }
    }, 300);

  } catch (err) {
    alert("عذراً، متعذر الوصول للكاميرا: " + err.message);
  }
}

// إيقاف تشغيل الكاميرا الحية
function stopLiveCamera() {
  if (qrVideoInterval) clearInterval(qrVideoInterval);
  if (qrStream) {
    qrStream.getTracks().forEach(track => track.stop());
    qrStream = null;
  }
  const cameraContainer = document.getElementById("qrCameraContainer");
  if (cameraContainer) cameraContainer.style.display = "none";
}

// نسخ النص المستخرج
function copyQrText() {
  const text = document.getElementById("qrScanText").innerText;
  if (text && !text.startsWith("❌")) {
    navigator.clipboard.writeText(text);
    alert("تم نسخ النص للحافظة بنجاح!");
  }
}

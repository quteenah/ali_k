// ==========================================
// أداة إزالة خلفية الصور
// ==========================================
window.openBgRemoverService = function () {
  if (typeof window.openServiceModal !== "function") return;

  window.openServiceModal(
    "✂️ إزالة خلفية الصور",
    `
    <div class="tool-modal-body">
      <p style="margin-bottom: 12px; color:#88ccee;">قم باختيار صورة لإزالة خلفيتها بالكامل:</p>
      <input type="file" id="bgUploadInput" accept="image/*" class="modal-file-input" style="margin-bottom: 15px;">
      
      <div id="bgWorkArea" class="bg-preview-area">
        <p style="color:#7799bb;">لم يتم اختيار صورة بعد</p>
      </div>
    </div>
  `
  );

  setTimeout(() => {
    const uploadInput = document.getElementById("bgUploadInput");
    const workArea = document.getElementById("bgWorkArea");

    uploadInput?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        workArea.innerHTML = `
          <div style="text-align: center;">
            <img src="${event.target.result}" id="sourceImg" style="max-width:100%; max-height:180px; border-radius:8px; border:1px solid #00ffaa44;">
            <div style="margin-top: 12px;">
              <button id="startRemoveBtn" class="action-btn-modal">إزالة الخلفية الآن ⚡</button>
            </div>
          </div>
        `;

        document.getElementById("startRemoveBtn")?.addEventListener("click", () => {
          workArea.innerHTML = `
            <div style="padding: 20px 5px; text-align: center;">
              <p id="progressStatus" style="color:#00ffaa; font-weight:bold; margin-bottom:12px;">جاري معالجة وإزالة الخلفية...</p>
              <div style="width: 100%; background: #0c1828; height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid #00ffaa66;">
                <div id="progressBar" style="width: 30%; height: 100%; background: linear-gradient(90deg, #00d9ff, #00ff88); transition: width 0.4s ease;"></div>
              </div>
            </div>
          `;

          const progressBar = document.getElementById("progressBar");
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = event.target.result;

          img.onload = () => {
            if (progressBar) progressBar.style.width = "70%";
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            const rBG = data[0], gBG = data[1], bBG = data[2];

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i], g = data[i + 1], b = data[i + 2];
              const diff = Math.abs(r - rBG) + Math.abs(g - gBG) + Math.abs(b - bBG);
              if (diff < 90) {
                data[i + 3] = 0;
              }
            }

            ctx.putImageData(imgData, 0, 0);
            if (progressBar) progressBar.style.width = "100%";

            const resultDataUrl = canvas.toDataURL("image/png");

            setTimeout(() => {
              workArea.innerHTML = `
                <div style="text-align: center;">
                  <p style="color:#00ffaa; font-size:12px; margin-bottom:8px;">الصورة الناتجة (بدون خلفية):</p>
                  <div style="background-image: linear-gradient(45deg, #1f293d 25%, transparent 25%), linear-gradient(-45deg, #1f293d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f293d 75%), linear-gradient(-45deg, transparent 75%, #1f293d 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0px; padding: 12px; border-radius: 8px; border: 1px solid #00ffaa;">
                    <img src="${resultDataUrl}" style="max-width:100%; max-height:220px;">
                  </div>
                  <div style="margin-top: 15px;">
                    <a href="${resultDataUrl}" download="no-bg.png" class="action-btn-modal" style="text-decoration:none; display:inline-block;">تحميل الصورة PNG 📥</a>
                  </div>
                </div>
              `;
            }, 300);
          };
        });
      };
      reader.readAsDataURL(file);
    });
  }, 100);
};

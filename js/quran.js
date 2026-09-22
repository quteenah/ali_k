// ==========================================
// 📖 أداة القرآن الكريم - Ali-K AI Box
// ==========================================

const QURAN_API = "https://api.alquran.cloud/v1";
// مسار الصورة المرفقة
const QURAN_LOGO_IMG = "images/Quran_kareem_orange_logo.png";

let quranSurahsList = [];

function openQuranService() {
  const modal = document.getElementById("modalContainer");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!modal || !title || !body) return;

  // عنوان النافذة المنبثقة مع الصورة المرفقة
  title.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <img src="${QURAN_LOGO_IMG}" alt="القرآن الكريم" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid #00d9ff;">
      <span>القرآن الكريم</span>
    </div>
  `;

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; font-family: system-ui, sans-serif; color: #fff; max-height: 75vh;">
      
      <!-- حقل البحث -->
      <div>
        <input type="search" id="quranSearchInput" oninput="filterQuranSurahs(this.value)" placeholder="🔍 ابحث عن سورة بالاسم أو الرقم..." style="width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box; font-size: 0.9rem;">
      </div>

      <!-- حاوية قائمة السور عرض القرآن -->
      <div id="quranContentBox" style="overflow-y: auto; max-height: 60vh; padding-right: 4px;">
        <div id="surahsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;"></div>
        <div id="quranView" style="display: none;"></div>
      </div>

    </div>
  `;

  modal.style.display = "flex";
  loadQuranSurahs();
}

// طلب API مع مهلة زمنية
async function quranApiRequest(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error("HTTP " + response.status);
    const json = await response.json();
    if (!json.data) throw new Error("البيانات غير موجودة");

    return json.data;
  } catch (error) {
    clearTimeout(timeout);
    console.error("Quran API Error:", error);
    throw error;
  }
}

// تحميل أسماء السور
async function loadQuranSurahs() {
  const grid = document.getElementById("surahsGrid");
  if (!grid) return;

  grid.style.display = "grid";
  grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #00d9ff; padding: 20px;">📖 جاري تحميل السور...</div>`;

  try {
    quranSurahsList = await quranApiRequest(`${QURAN_API}/surah`);
    renderSurahsGrid(quranSurahsList);
  } catch (error) {
    showQuranError("تعذر تحميل السور", "يرجى التأكد من الاتصال بالإنترنت وإعادة المحاولة.");
  }
}

// عرض السور في شبكة (Grid)
function renderSurahsGrid(list) {
  const grid = document.getElementById("surahsGrid");
  const view = document.getElementById("quranView");
  if (!grid) return;

  grid.style.display = "grid";
  if (view) view.style.display = "none";
  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 20px;">لا توجد نتائج مطابقة</div>`;
    return;
  }

  list.forEach(surah => {
    const btn = document.createElement("button");
    btn.style.cssText = "background: #0f172a; border: 1px solid #1e293b; color: #fff; padding: 10px; border-radius: 8px; cursor: pointer; text-align: center; transition: 0.2s;";
    btn.onmouseover = () => btn.style.borderColor = "#00d9ff";
    btn.onmouseout = () => btn.style.borderColor = "#1e293b";
    
    btn.innerHTML = `
      <div style="font-size: 0.8rem; color: #00d9ff; font-weight: bold;">${surah.number}</div>
      <div style="font-size: 0.95rem; font-weight: bold; margin-top: 2px;">${surah.name}</div>
    `;

    btn.addEventListener("click", () => loadSurahContent(surah.number));
    grid.appendChild(btn);
  });
}

// تحميل الآيات للسورة المحددة
async function loadSurahContent(number) {
  const grid = document.getElementById("surahsGrid");
  const view = document.getElementById("quranView");

  if (grid) grid.style.display = "none";
  if (view) {
    view.style.display = "block";
    view.innerHTML = `<div style="text-align: center; color: #00d9ff; padding: 20px;">📖 جاري تحميل السورة...</div>`;
  }

  try {
    const surah = await quranApiRequest(`${QURAN_API}/surah/${number}/quran-uthmani`);
    renderSurahContent(surah);
  } catch (error) {
    showQuranError("تعذر تحميل السورة", "تحقق من الاتصال بالإنترنت وأعد المحاولة.");
  }
}

// عرض نص السورة
function renderSurahContent(surah) {
  const view = document.getElementById("quranView");
  if (!view) return;

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <button onclick="backToSurahsList()" style="background: #1e293b; color: #00d9ff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: bold;">
        ← قائمة السور
      </button>
      <h3 style="margin: 0; color: #fff; display: flex; align-items: center; gap: 6px;">
        سورة ${surah.name}
      </h3>
    </div>
  `;

  if (surah.number !== 9) {
    html += `
      <div style="text-align: center; font-size: 1.2rem; color: #00d9ff; margin: 15px 0; font-family: 'Amiri', serif;">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
    `;
  }

  html += `<div style="line-height: 2.2; font-size: 1.15rem; text-align: justify; direction: rtl; background: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #1e293b;">`;

  surah.ayahs.forEach(ayah => {
    html += `
      <span>${ayah.text}</span>
      <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; border: 1px solid #00d9ff; color: #00d9ff; font-size: 0.75rem; margin: 0 4px;">${ayah.numberInSurah}</span>
    `;
  });

  html += `</div>`;

  html += `
    <button onclick="backToSurahsList()" style="width: 100%; margin-top: 12px; background: #1e293b; color: #00d9ff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold;">
      ← العودة لقائمة السور
    </button>
  `;

  view.innerHTML = html;
  document.getElementById("quranContentBox").scrollTop = 0;
}

// العودة للقائمة
function backToSurahsList() {
  const grid = document.getElementById("surahsGrid");
  const view = document.getElementById("quranView");
  if (view) view.style.display = "none";
  if (grid) grid.style.display = "grid";
}

// تصفية السور بالبحث
function filterQuranSurahs(value) {
  const query = value.trim().toLowerCase();
  if (!query) {
    renderSurahsGrid(quranSurahsList);
    return;
  }

  const filtered = quranSurahsList.filter(surah => 
    surah.name.includes(query) ||
    surah.englishName.toLowerCase().includes(query) ||
    String(surah.number).includes(query)
  );

  renderSurahsGrid(filtered);
}

// عرض الخطأ
function showQuranError(title, message) {
  const grid = document.getElementById("surahsGrid");
  if (!grid) return;

  grid.style.display = "block";
  grid.innerHTML = `
    <div style="text-align: center; background: rgba(255, 71, 87, 0.1); border: 1px solid #ff4757; padding: 15px; border-radius: 8px;">
      <h4 style="color: #ff4757; margin: 0 0 6px 0;">⚠️ ${title}</h4>
      <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 10px;">${message}</p>
      <button onclick="loadQuranSurahs()" style="background: #ff4757; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">
        🔄 إعادة المحاولة
      </button>
    </div>
  `;
}

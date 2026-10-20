// ==========================================
// مشغل IPTV المتقدم الشامل (Ali-K IPTV Live)
// ==========================================

function openIptvService() {
  const modal = document.getElementById("modalContainer");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!modal || !title || !body) {
    alert("عذراً، تعذر العثور على حاوية النافذة المنبثقة Modal في الصفحة!");
    return;
  }

  // ضبط العنوان
  title.innerHTML = '<i class="fa-solid fa-tv" style="color: #3b82f6;"></i> مشغل IPTV المباشر';

  // تحميل Tailwind CSS و HLS.js إن لم يكونا موجودين
  if (!document.getElementById('tailwind-cdn')) {
    const tw = document.createElement('script');
    tw.id = 'tailwind-cdn';
    tw.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tw);
  }
  if (!window.Hls) {
    const hls = document.createElement('script');
    hls.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    document.head.appendChild(hls);
  }

  // بناء واجهة IPTV المتقدمة
  body.innerHTML = `
    <div class="iptv-wrapper text-slate-100 font-sans text-right" style="direction: rtl; max-height: 75vh; overflow-y: auto; padding: 2px;">
      
      <!-- QUICK PRESET PLAYLISTS BANNER -->
      <div class="bg-slate-950/80 border border-slate-800/80 py-2 px-3 rounded-xl mb-3">
        <div class="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none py-1">
          <span class="text-slate-400 font-bold whitespace-nowrap"><i class="fa-solid fa-layer-group text-blue-400 ml-1"></i> القوائم المجهزة:</span>
          <button type="button" onclick="loadPlaylistPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'القنوات العربية')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 whitespace-nowrap hover:bg-blue-500/30 transition">
            <i class="fa-solid fa-globe ml-1"></i> القنوات العربية
          </button>
          <button type="button" onclick="loadPlaylistPreset('https://iptv-org.github.io/iptv/categories/news.m3u', 'قنوات الأخبار')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap hover:bg-slate-700 transition">
            <i class="fa-solid fa-newspaper ml-1"></i> الأخبار
          </button>
          <button type="button" onclick="loadPlaylistPreset('https://iptv-org.github.io/iptv/categories/sport.m3u', 'قنوات الرياضة')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap hover:bg-slate-700 transition">
            <i class="fa-solid fa-football ml-1"></i> الرياضة
          </button>
          <button type="button" onclick="loadPlaylistPreset('https://iptv-org.github.io/iptv/categories/kids.m3u', 'قنوات الأطفال')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap hover:bg-slate-700 transition">
            <i class="fa-solid fa-child ml-1"></i> الأطفال
          </button>
          <button type="button" onclick="loadPlaylistPreset('https://iptv-org.github.io/iptv/index.m3u', 'القائمة العالمية الشاملة')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 whitespace-nowrap hover:bg-purple-500/30 transition">
            <i class="fa-solid fa-earth-americas ml-1"></i> القائمة العالمية
          </button>
        </div>
      </div>

      <!-- SEARCH & CONTROLS BAR -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
        <div class="relative flex-1 min-w-[180px]">
          <i class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input type="text" id="iptvSearchInput" oninput="onIptvSearchInput()" placeholder="بحث باسم القناة أو المجموعة..." 
            class="w-full pr-8 pl-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500">
        </div>
        <button type="button" onclick="openCustomM3uPrompt()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
          <i class="fa-solid fa-link"></i> رابط مخصص
        </button>
      </div>

      <!-- MAIN LAYOUT GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        <!-- PLAYER CONTAINER -->
        <div class="lg:col-span-2 flex flex-col gap-2">
          <div class="relative w-full bg-black rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
            <video id="iptvVideoPlayer" class="w-full h-full object-contain hidden" playsinline controls></video>
            <iframe id="iptvIframePlayer" class="w-full h-full border-0 hidden" allowfullscreen allow="autoplay; encrypted-media"></iframe>

            <div id="iptvOverlay" class="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center gap-2 text-center p-4 z-10">
              <div id="iptvSpinner" class="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin hidden"></div>
              <i id="iptvOverlayIcon" class="fa-solid fa-circle-play text-4xl text-blue-500"></i>
              <p id="iptvOverlayText" class="text-slate-200 font-semibold text-xs sm:text-sm">اختر قناة من القائمة لبدء المشاهدة</p>
            </div>
          </div>

          <!-- Active Channel Info Bar -->
          <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div id="iptvLogoContainer" class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                <i class="fa-solid fa-tv text-slate-500 text-xs"></i>
              </div>
              <div class="truncate">
                <h4 id="iptvCurrentTitle" class="font-bold text-xs text-slate-100 truncate">لم يتم اختيار قناة</h4>
                <div class="flex items-center gap-2 text-[10px] text-slate-400">
                  <span id="iptvCurrentCategory">---</span> • <span id="iptvCurrentGroup">---</span>
                </div>
              </div>
            </div>
            <button type="button" id="iptvFavBtn" onclick="toggleIptvCurrentFav()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs flex items-center gap-1 border border-slate-700">
              <i class="fa-regular fa-star"></i> المفضلة
            </button>
          </div>
        </div>

        <!-- CHANNELS SIDEBAR -->
        <div class="flex flex-col gap-2">
          
          <!-- Category Tabs -->
          <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]" id="iptvCategoriesBar">
            <!-- JS Renders categories -->
          </div>

          <!-- Status Indicator -->
          <div class="bg-slate-900/90 px-2.5 py-1 rounded-lg flex items-center justify-between text-[10px] text-slate-300 border border-slate-800">
            <span id="iptvStatusText"><i class="fa-solid fa-spinner fa-spin text-blue-400 ml-1"></i> جاري التحميل...</span>
            <span id="iptvCountBadge" class="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-bold">0 قناة</span>
          </div>

          <!-- Channels List -->
          <div id="iptvChannelsGrid" class="grid grid-cols-1 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
            <!-- JS Renders Channel Cards -->
          </div>
        </div>

      </div>
    </div>
  `;

  // إظهار النافذة
  modal.style.display = "flex";

  // إطلاق التطبيق
  setTimeout(() => {
    initIptvApp();
  }, 50);
}

// جعل الدالة متاحة عالمياً على نطاق window
window.openIptvService = openIptvService;

// ربط الزر تلقائياً فور تحميل الصفحة كخطة احتياطية
document.addEventListener("DOMContentLoaded", function () {
  const card = document.getElementById("iptvToolCard");
  if (card) {
    card.addEventListener("click", openIptvService);
  }
});

// ================= GLOBAL STATE & LOGIC =================
let iptvRawChannels = [];
let iptvFilteredChannels = [];
let iptvFavorites = JSON.parse(localStorage.getItem('iptv_favs_v3') || '[]');
let iptvActiveCategory = 'الكل';
let iptvCurrentChannel = null;
let iptvHlsInstance = null;

const iptvCategories = ['الكل', 'المفضلة', 'أخبار', 'رياضة', 'أطفال', 'إسلاميات', 'ترفيه', 'عام'];

function initIptvApp() {
  renderIptvCategories();
  loadPlaylistPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'القنوات العربية');
}

function renderIptvCategories() {
  const container = document.getElementById('iptvCategoriesBar');
  if (!container) return;
  container.innerHTML = iptvCategories.map(cat => `
    <button type="button" onclick="selectIptvCategory('${cat}')" 
      class="px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition ${iptvActiveCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700/60 hover:bg-slate-700'}">
      ${cat === 'المفضلة' ? '<i class="fa-solid fa-star text-amber-400 ml-1"></i>' : ''}${cat}
    </button>
  `).join('');
}

async function loadPlaylistPreset(url, name) {
  updateIptvStatus(`<i class="fa-solid fa-spinner fa-spin text-blue-400 ml-1"></i> جاري جلب ${name}...`, '0 قناة');
  showIptvOverlaySpinner(true, `جاري جلب قنوات ${name}...`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const text = await res.text();
    
    iptvRawChannels = parseM3UContent(text);
    updateIptvStatus(`<i class="fa-solid fa-check text-emerald-400 ml-1"></i> تم تحميل ${name}`, `${iptvRawChannels.length} قناة`);
    showIptvOverlaySpinner(false);

    filterAndRenderIptvChannels();

    if (iptvFilteredChannels.length > 0) {
      playIptvChannel(iptvFilteredChannels[0]);
    }
  } catch (err) {
    updateIptvStatus(`<i class="fa-solid fa-triangle-exclamation text-amber-400 ml-1"></i> خطأ في التحميل`, '0 قناة');
    showIptvOverlayText('فشل تحميل القائمة. تحقق من اتصالك بالإنترنت.');
  }
}

function parseM3UContent(text) {
  const lines = text.split('\n');
  const channels = [];
  let cur = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      cur = {};
      const comma = line.lastIndexOf(',');
      cur.name = comma !== -1 ? line.substring(comma + 1).trim() : 'قناة بدون اسم';

      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      cur.logo = logoMatch ? logoMatch[1] : '';

      const groupMatch = line.match(/group-title="([^"]+)"/);
      cur.group = groupMatch ? groupMatch[1] : 'عام';

      cur.id = 'ch_' + Math.random().toString(36).substr(2, 9);
    } else if (line && !line.startsWith('#') && cur) {
      cur.url = line;
      cur.category = detectIptvCategory(cur.group, cur.name);
      channels.push(cur);
      cur = null;
    }
  }
  return channels;
}

function detectIptvCategory(group, name) {
  const combined = (group + ' ' + name).toLowerCase();
  if (combined.includes('news') || combined.includes('أخبار') || combined.includes('اخبار')) return 'أخبار';
  if (combined.includes('sport') || combined.includes('رياضة') || combined.includes('kora')) return 'رياضة';
  if (combined.includes('kid') || combined.includes('أطفال') || combined.includes('اطفال')) return 'أطفال';
  if (combined.includes('quran') || combined.includes('قرآن') || combined.includes('إسلام')) return 'إسلاميات';
  if (combined.includes('movie') || combined.includes('سينما') || combined.includes('drama') || combined.includes('دراما')) return 'ترفيه';
  return 'عام';
}

function filterAndRenderIptvChannels() {
  const input = document.getElementById('iptvSearchInput');
  const query = input ? input.value.trim().toLowerCase() : '';

  iptvFilteredChannels = iptvRawChannels.filter(ch => {
    const matchCat = iptvActiveCategory === 'الكل' ? true :
                      iptvActiveCategory === 'المفضلة' ? iptvFavorites.includes(ch.id) :
                      ch.category === iptvActiveCategory;

    const matchSearch = !query || ch.name.toLowerCase().includes(query) || ch.group.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  renderIptvGrid();
}

function renderIptvGrid() {
  const grid = document.getElementById('iptvChannelsGrid');
  if (!grid) return;

  if (iptvFilteredChannels.length === 0) {
    grid.innerHTML = `
      <div class="text-center py-6 text-slate-500 text-xs">
        <i class="fa-solid fa-tv text-xl mb-1"></i>
        <p>لا توجد قنوات مطابقة</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = iptvFilteredChannels.slice(0, 100).map(ch => {
    const isFav = iptvFavorites.includes(ch.id);
    const isActive = iptvCurrentChannel && iptvCurrentChannel.id === ch.id;

    return `
      <div onclick="playIptvChannelById('${ch.id}')" 
        class="p-2 rounded-lg flex items-center justify-between cursor-pointer transition border text-xs ${isActive ? 'border-blue-500 bg-blue-500/20' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}">
        
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-6 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            ${ch.logo ? `<img src="${ch.logo}" class="w-full h-full object-contain" onerror="this.remove()">` : `<i class="fa-solid fa-tv text-slate-600 text-[9px]"></i>`}
          </div>
          <div class="truncate">
            <h5 class="font-bold text-slate-200 truncate text-[11px]">${ch.name}</h5>
            <span class="text-[9px] text-slate-400 block">${ch.group || ch.category}</span>
          </div>
        </div>

        <button type="button" onclick="event.stopPropagation(); toggleIptvFav('${ch.id}')" class="p-1 text-slate-400 hover:text-amber-400">
          <i class="${isFav ? 'fa-solid text-amber-400' : 'fa-regular'} fa-star"></i>
        </button>
      </div>
    `;
  }).join('');
}

function playIptvChannel(ch) {
  iptvCurrentChannel = ch;

  document.getElementById('iptvCurrentTitle').innerText = ch.name;
  document.getElementById('iptvCurrentCategory').innerText = ch.category;
  document.getElementById('iptvCurrentGroup').innerText = ch.group || 'عام';

  const logoBox = document.getElementById('iptvLogoContainer');
  logoBox.innerHTML = ch.logo 
    ? `<img src="${ch.logo}" class="w-full h-full object-contain p-0.5" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-tv text-slate-500\\'></i>'">`
    : `<i class="fa-solid fa-tv text-slate-500"></i>`;

  updateIptvFavBtn();
  showIptvOverlaySpinner(true, 'جاري تشغيل القناة...');

  const video = document.getElementById('iptvVideoPlayer');
  const iframe = document.getElementById('iptvIframePlayer');

  if (iptvHlsInstance) {
    iptvHlsInstance.destroy();
    iptvHlsInstance = null;
  }

  video.classList.add('hidden');
  iframe.classList.add('hidden');

  if (ch.url.includes('youtube.com') || ch.url.includes('embed')) {
    iframe.src = ch.url;
    iframe.classList.remove('hidden');
    setTimeout(() => showIptvOverlaySpinner(false), 500);
  } else {
    video.classList.remove('hidden');

    if (window.Hls && window.Hls.isSupported() && (ch.url.includes('.m3u8') || !ch.url.includes('.'))) {
      iptvHlsInstance = new window.Hls();
      iptvHlsInstance.loadSource(ch.url);
      iptvHlsInstance.attachMedia(video);
      iptvHlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        showIptvOverlaySpinner(false);
      });
      iptvHlsInstance.on(window.Hls.Events.ERROR, () => {
        showIptvOverlayText('تعذر تحميل هذا البث المباشر حالياً.');
      });
    } else {
      video.src = ch.url;
      video.play().then(() => showIptvOverlaySpinner(false)).catch(() => {
        showIptvOverlayText('توقف رابط البث المباشر من المصدر.');
      });
    }
  }

  renderIptvGrid();
}

function playIptvChannelById(id) {
  const ch = iptvRawChannels.find(c => c.id === id);
  if (ch) playIptvChannel(ch);
}

function selectIptvCategory(cat) {
  iptvActiveCategory = cat;
  renderIptvCategories();
  filterAndRenderIptvChannels();
}

function onIptvSearchInput() {
  filterAndRenderIptvChannels();
}

function toggleIptvFav(id) {
  if (iptvFavorites.includes(id)) {
    iptvFavorites = iptvFavorites.filter(f => f !== id);
  } else {
    iptvFavorites.push(id);
  }
  localStorage.setItem('iptv_favs_v3', JSON.stringify(iptvFavorites));
  updateIptvFavBtn();
  renderIptvGrid();
}

function toggleIptvCurrentFav() {
  if (iptvCurrentChannel) toggleIptvFav(iptvCurrentChannel.id);
}

function updateIptvFavBtn() {
  const btn = document.getElementById('iptvFavBtn');
  if (!btn || !iptvCurrentChannel) return;
  const isFav = iptvFavorites.includes(iptvCurrentChannel.id);
  btn.innerHTML = isFav 
    ? '<i class="fa-solid fa-star text-amber-400"></i> في المفضلة'
    : '<i class="fa-regular fa-star text-amber-400"></i> المفضلة';
}

function openCustomM3uPrompt() {
  const url = prompt("أدخل رابط قائمة M3U المخصصة (.m3u / .m3u8):");
  if (url && url.trim()) {
    loadPlaylistPreset(url.trim(), 'قائمة مخصصة');
  }
}

function showIptvOverlaySpinner(show, text) {
  const overlay = document.getElementById('iptvOverlay');
  const spinner = document.getElementById('iptvSpinner');
  const icon = document.getElementById('iptvOverlayIcon');
  const overlayText = document.getElementById('iptvOverlayText');

  if (!overlay) return;
  if (show) {
    overlay.classList.remove('hidden');
    if (spinner) spinner.classList.remove('hidden');
    if (icon) icon.classList.add('hidden');
    if (overlayText) overlayText.innerText = text || '';
  } else {
    overlay.classList.add('hidden');
  }
}

function showIptvOverlayText(text) {
  const overlay = document.getElementById('iptvOverlay');
  const spinner = document.getElementById('iptvSpinner');
  const icon = document.getElementById('iptvOverlayIcon');
  const overlayText = document.getElementById('iptvOverlayText');

  if (!overlay) return;
  overlay.classList.remove('hidden');
  if (spinner) spinner.classList.add('hidden');
  if (icon) icon.classList.remove('hidden');
  if (overlayText) overlayText.innerText = text;
}

function updateIptvStatus(html, count) {
  const status = document.getElementById('iptvStatusText');
  const badge = document.getElementById('iptvCountBadge');
  if (status) status.innerHTML = html;
  if (badge) badge.innerText = count;
}

// جعل جميع الدوال متاحة على النطاق العام للحد من أي مشكلة في الاستدعاء
window.loadPlaylistPreset = loadPlaylistPreset;
window.onIptvSearchInput = onIptvSearchInput;
window.openCustomM3uPrompt = openCustomM3uPrompt;
window.toggleIptvCurrentFav = toggleIptvCurrentFav;
window.selectIptvCategory = selectIptvCategory;
window.playIptvChannelById = playIptvChannelById;
window.toggleIptvFav = toggleIptvFav;
 

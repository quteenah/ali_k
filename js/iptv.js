// ==========================================
// مشغل IPTV المتقدم الشامل (Ali-K IPTV Live)
// ==========================================

window.openIptvService = function () {
  // التأكد من استدعاء Tailwind CSS و HLS.js
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

  const iptvFullHtml = `
    <div class="iptv-wrapper text-slate-100 font-sans text-right" style="direction: rtl; max-height: 85vh; overflow-y: auto; padding: 2px;">
      
      <!-- QUICK PRESET PLAYLISTS BANNER -->
      <div class="bg-slate-950/80 border-b border-slate-800/60 py-2 px-3 rounded-xl mb-3">
        <div class="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none py-1">
          <span class="text-slate-400 font-bold whitespace-nowrap"><i class="fa-solid fa-layer-group text-blue-400 ml-1"></i> القوائم المجهزة:</span>
          <button onclick="window.loadPlaylistPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'القنوات العربية')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 whitespace-nowrap hover:bg-blue-500/30 transition">
            <i class="fa-solid fa-globe ml-1"></i> القنوات العربية
          </button>
          <button onclick="window.loadPlaylistPreset('https://iptv-org.github.io/iptv/categories/news.m3u', 'قنوات الأخبار')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap hover:bg-slate-700 transition">
            <i class="fa-solid fa-newspaper ml-1"></i> الأخبار
          </button>
          <button onclick="window.loadPlaylistPreset('https://iptv-org.github.io/iptv/categories/sport.m3u', 'قنوات الرياضة')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap hover:bg-slate-700 transition">
            <i class="fa-solid fa-football ml-1"></i> الرياضة
          </button>
          <button onclick="window.loadPlaylistPreset('https://iptv-org.github.io/iptv/categories/kids.m3u', 'قنوات الأطفال')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap hover:bg-slate-700 transition">
            <i class="fa-solid fa-child ml-1"></i> الأطفال
          </button>
          <button onclick="window.loadPlaylistPreset('https://iptv-org.github.io/iptv/index.m3u', 'القائمة العالمية الشاملة')" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 whitespace-nowrap hover:bg-purple-500/30 transition">
            <i class="fa-solid fa-earth-americas ml-1"></i> القائمة العالمية
          </button>
        </div>
      </div>

      <!-- SEARCH & CONTROLS BAR -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
        <div class="relative flex-1 min-w-[200px]">
          <i class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input type="text" id="iptvSearchInput" oninput="window.onIptvSearchInput()" placeholder="بحث باسم القناة أو المجموعة..." 
            class="w-full pr-8 pl-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500">
        </div>
        <button onclick="window.openCustomM3uPrompt()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
          <i class="fa-solid fa-link"></i> رابط مخصص
        </button>
      </div>

      <!-- MAIN LAYOUT GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        <!-- PLAYER CONTAINER (LEFT / TOP) -->
        <div class="lg:col-span-2 flex flex-col gap-2">
          <div class="relative w-full bg-black rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
            <video id="iptvVideoPlayer" class="w-full h-full object-contain hidden" playsinline controls></video>
            <iframe id="iptvIframePlayer" class="w-full h-full border-0 hidden" allowfullscreen allow="autoplay; encrypted-media"></iframe>

            <div id="iptvOverlay" class="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center gap-2 text-center p-4 z-10">
              <div id="iptvSpinner" class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin hidden"></div>
              <i id="iptvOverlayIcon" class="fa-solid fa-circle-play text-4xl text-blue-500"></i>
              <p id="iptvOverlayText" class="text-slate-200 font-semibold text-xs sm:text-sm">اختر قناة من القائمة لبدء المشاهدة</p>
            </div>
          </div>

          <!-- Active Channel Info Bar -->
          <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div id="iptvLogoContainer" class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                <i class="fa-solid fa-tv text-slate-500 text-sm"></i>
              </div>
              <div class="truncate">
                <h4 id="iptvCurrentTitle" class="font-bold text-xs sm:text-sm text-slate-100 truncate">لم يتم اختيار قناة</h4>
                <div class="flex items-center gap-2 text-[10px] text-slate-400">
                  <span id="iptvCurrentCategory">---</span> • <span id="iptvCurrentGroup">---</span>
                </div>
              </div>
            </div>
            <button id="iptvFavBtn" onclick="window.toggleIptvCurrentFav()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs flex items-center gap-1 border border-slate-700">
              <i class="fa-regular fa-star"></i> المفضلة
            </button>
          </div>
        </div>

        <!-- CHANNELS SIDEBAR (RIGHT / BOTTOM) -->
        <div class="flex flex-col gap-2">
          
          <!-- Category Tabs -->
          <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]" id="iptvCategoriesBar">
            <!-- JS Renders categories -->
          </div>

          <!-- Status Indicator -->
          <div class="bg-slate-900/90 px-3 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-300 border border-slate-800">
            <span id="iptvStatusText"><i class="fa-solid fa-spinner fa-spin text-blue-400 ml-1"></i> جاري التحميل...</span>
            <span id="iptvCountBadge" class="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">0 قناة</span>
          </div>

          <!-- Channels List -->
          <div id="iptvChannelsGrid" class="grid grid-cols-1 gap-1.5 max-h-[320px] overflow-y-auto pr-1">
            <!-- JS Renders Channel Cards -->
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📺 مشغل IPTV المباشر المتقدم", iptvHtml, false);
  }

  // تهيئة الحالة والبدء بتحميل القنوات العربية افتراضياً
  setTimeout(() => {
    window.initIptvApp();
  }, 100);
};

// ================= GLOBAL STATE & LOGIC =================
let iptvRawChannels = [];
let iptvFilteredChannels = [];
let iptvFavorites = JSON.parse(localStorage.getItem('iptv_favs_v3') || '[]');
let iptvActiveCategory = 'الكل';
let iptvCurrentChannel = null;
let iptvHlsInstance = null;

const iptvCategories = ['الكل', 'المفضلة', 'أخبار', 'رياضة', 'أطفال', 'إسلاميات', 'ترفيه', 'عام'];

window.initIptvApp = function () {
  window.renderIptvCategories();
  window.loadPlaylistPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'القنوات العربية');
};

window.renderIptvCategories = function () {
  const container = document.getElementById('iptvCategoriesBar');
  if (!container) return;
  container.innerHTML = iptvCategories.map(cat => `
    <button onclick="window.selectIptvCategory('${cat}')" 
      class="px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${iptvActiveCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700/60 hover:bg-slate-700'}">
      ${cat === 'المفضلة' ? '<i class="fa-solid fa-star text-amber-400 ml-1"></i>' : ''}${cat}
    </button>
  `).join('');
};

window.loadPlaylistPreset = async function (url, name) {
  window.updateIptvStatus(`<i class="fa-solid fa-spinner fa-spin text-blue-400 ml-1"></i> جاري جلب ${name}...`, '0 قناة');
  window.showIptvOverlaySpinner(true, `جاري جلب قنوات ${name}...`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const text = await res.text();
    
    iptvRawChannels = window.parseM3UContent(text);
    window.updateIptvStatus(`<i class="fa-solid fa-check text-emerald-400 ml-1"></i> تم تحميل ${name}`, `${iptvRawChannels.length} قناة`);
    window.showIptvOverlaySpinner(false);

    window.filterAndRenderIptvChannels(true);

    if (iptvFilteredChannels.length > 0) {
      window.playIptvChannel(iptvFilteredChannels[0]);
    }
  } catch (err) {
    window.updateIptvStatus(`<i class="fa-solid fa-triangle-exclamation text-amber-400 ml-1"></i> خطأ في جلب القنوات`, '0 قناة');
    window.showIptvOverlayText('فشل تحميل القائمة. تحقق من اتصالك أو جرب رابطاً آخر.');
  }
};

window.parseM3UContent = function (text) {
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
      cur.category = window.detectIptvCategory(cur.group, cur.name);
      channels.push(cur);
      cur = null;
    }
  }
  return channels;
};

window.detectIptvCategory = function (group, name) {
  const combined = (group + ' ' + name).toLowerCase();
  if (combined.includes('news') || combined.includes('أخبار') || combined.includes('اخبار')) return 'أخبار';
  if (combined.includes('sport') || combined.includes('رياضة') || combined.includes('kora')) return 'رياضة';
  if (combined.includes('kid') || combined.includes('أطفال') || combined.includes('اطفال')) return 'أطفال';
  if (combined.includes('quran') || combined.includes('قرآن') || combined.includes('إسلام')) return 'إسلاميات';
  if (combined.includes('movie') || combined.includes('سينما') || combined.includes('drama') || combined.includes('دراما')) return 'ترفيه';
  return 'عام';
};

window.filterAndRenderIptvChannels = function () {
  const input = document.getElementById('iptvSearchInput');
  const query = input ? input.value.trim().toLowerCase() : '';

  iptvFilteredChannels = iptvRawChannels.filter(ch => {
    const matchCat = iptvActiveCategory === 'الكل' ? true :
                      iptvActiveCategory === 'المفضلة' ? iptvFavorites.includes(ch.id) :
                      ch.category === iptvActiveCategory;

    const matchSearch = !query || ch.name.toLowerCase().includes(query) || ch.group.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  window.renderIptvGrid();
};

window.renderIptvGrid = function () {
  const grid = document.getElementById('iptvChannelsGrid');
  if (!grid) return;

  if (iptvFilteredChannels.length === 0) {
    grid.innerHTML = `
      <div class="text-center py-8 text-slate-500 text-xs">
        <i class="fa-solid fa-tv text-2xl mb-1"></i>
        <p>لا توجد قنوات مطابقة</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = iptvFilteredChannels.slice(0, 100).map(ch => {
    const isFav = iptvFavorites.includes(ch.id);
    const isActive = iptvCurrentChannel && iptvCurrentChannel.id === ch.id;

    return `
      <div onclick="window.playIptvChannelById('${ch.id}')" 
        class="p-2 rounded-lg flex items-center justify-between cursor-pointer transition border text-xs ${isActive ? 'border-blue-500 bg-blue-500/20' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}">
        
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            ${ch.logo ? `<img src="${ch.logo}" class="w-full h-full object-contain" onerror="this.remove()">` : `<i class="fa-solid fa-tv text-slate-600 text-[10px]"></i>`}
          </div>
          <div class="truncate">
            <h5 class="font-bold text-slate-200 truncate text-[11px]">${ch.name}</h5>
            <span class="text-[9px] text-slate-400 block">${ch.group || ch.category}</span>
          </div>
        </div>

        <button onclick="event.stopPropagation(); window.toggleIptvFav('${ch.id}')" class="p-1 text-slate-400 hover:text-amber-400">
          <i class="${isFav ? 'fa-solid text-amber-400' : 'fa-regular'} fa-star"></i>
        </button>
      </div>
    `;
  }).join('');
};

window.playIptvChannel = function (ch) {
  iptvCurrentChannel = ch;

  document.getElementById('iptvCurrentTitle').innerText = ch.name;
  document.getElementById('iptvCurrentCategory').innerText = ch.category;
  document.getElementById('iptvCurrentGroup').innerText = ch.group || 'عام';

  const logoBox = document.getElementById('iptvLogoContainer');
  logoBox.innerHTML = ch.logo 
    ? `<img src="${ch.logo}" class="w-full h-full object-contain p-0.5" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-tv text-slate-500\\'></i>'">`
    : `<i class="fa-solid fa-tv text-slate-500"></i>`;

  window.updateIptvFavBtn();
  window.showIptvOverlaySpinner(true, 'جاري فتح القناة...');

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
    setTimeout(() => window.showIptvOverlaySpinner(false), 500);
  } else {
    video.classList.remove('hidden');

    if (window.Hls && window.Hls.isSupported() && (ch.url.includes('.m3u8') || !ch.url.includes('.'))) {
      iptvHlsInstance = new window.Hls();
      iptvHlsInstance.loadSource(ch.url);
      iptvHlsInstance.attachMedia(video);
      iptvHlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        window.showIptvOverlaySpinner(false);
      });
      iptvHlsInstance.on(window.Hls.Events.ERROR, () => {
        window.showIptvOverlayText('تعذر تحميل هذا البث المباشر حالياً.');
      });
    } else {
      video.src = ch.url;
      video.play().then(() => window.showIptvOverlaySpinner(false)).catch(() => {
        window.showIptvOverlayText('توقف رابط البث المباشر من المصدر.');
      });
    }
  }

  window.renderIptvGrid();
};

window.playIptvChannelById = function (id) {
  const ch = iptvRawChannels.find(c => c.id === id);
  if (ch) window.playIptvChannel(ch);
};

window.selectIptvCategory = function (cat) {
  iptvActiveCategory = cat;
  window.renderIptvCategories();
  window.filterAndRenderIptvChannels();
};

window.onIptvSearchInput = function () {
  window.filterAndRenderIptvChannels();
};

window.toggleIptvFav = function (id) {
  if (iptvFavorites.includes(id)) {
    iptvFavorites = iptvFavorites.filter(f => f !== id);
  } else {
    iptvFavorites.push(id);
  }
  localStorage.setItem('iptv_favs_v3', JSON.stringify(iptvFavorites));
  window.updateIptvFavBtn();
  window.renderIptvGrid();
};

window.toggleIptvCurrentFav = function () {
  if (iptvCurrentChannel) window.toggleIptvFav(iptvCurrentChannel.id);
};

window.updateIptvFavBtn = function () {
  const btn = document.getElementById('iptvFavBtn');
  if (!btn || !iptvCurrentChannel) return;
  const isFav = iptvFavorites.includes(iptvCurrentChannel.id);
  btn.innerHTML = isFav 
    ? '<i class="fa-solid fa-star text-amber-400"></i> في المفضلة'
    : '<i class="fa-regular fa-star text-amber-400"></i> المفضلة';
};

window.openCustomM3uPrompt = function () {
  const url = prompt("أدخل رابط قائمة M3U المخصصة (.m3u / .m3u8):");
  if (url && url.trim()) {
    window.loadPlaylistPreset(url.trim(), 'قائمة مخصصة');
  }
};

window.showIptvOverlaySpinner = function (show, text) {
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
};

window.showIptvOverlayText = function (text) {
  const overlay = document.getElementById('iptvOverlay');
  const spinner = document.getElementById('iptvSpinner');
  const icon = document.getElementById('iptvOverlayIcon');
  const overlayText = document.getElementById('iptvOverlayText');

  if (!overlay) return;
  overlay.classList.remove('hidden');
  if (spinner) spinner.classList.add('hidden');
  if (icon) icon.classList.remove('hidden');
  if (overlayText) overlayText.innerText = text;
};

window.updateIptvStatus = function (html, count) {
  const status = document.getElementById('iptvStatusText');
  const badge = document.getElementById('iptvCountBadge');
  if (status) status.innerHTML = html;
  if (badge) badge.innerText = count;
};

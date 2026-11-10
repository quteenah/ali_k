// ==========================================
// مشغل IPTV المتقدم والسريع جداً (Ali-K IPTV Live)
// ==========================================

function openIptvService() {
  const modal = document.getElementById("modalContainer");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (!modal || !title || !body) {
    alert("عذراً، تعذر العثور على حاوية النافذة المنبثقة Modal في الصفحة!");
    return;
  }

  title.innerHTML = '<i class="fa-solid fa-tv" style="color: #6366f1;"></i> مشغل القنوات المباشرة | IPTV Fast Player';

  if (!document.getElementById('tailwind-cdn')) {
    const tw = document.createElement('script');
    tw.id = 'tailwind-cdn';
    tw.src = 'https://cdn.tailwindcss.com';
    tw.onload = () => {
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 900: '#312e81' },
              darkbg: '#0b0f19',
              darkcard: '#151c2c',
              darkborder: '#232d42'
            }
          }
        }
      };
    };
    document.head.appendChild(tw);
  }
  
  if (!window.Hls) {
    const hlsScript = document.createElement('script');
    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    document.head.appendChild(hlsScript);
  }

  // استخدام onclick مباشر داخل زر القائمة لضمان الاستجابة الفورية 100%
  body.innerHTML = `
    <div class="bg-[#0b0f19] text-gray-100 flex flex-col h-[78vh] overflow-hidden rounded-xl border border-[#232d42]" style="direction: rtl;">

      <!-- Header -->
      <header class="bg-[#151c2c] border-b border-[#232d42] px-3 py-2 flex items-center justify-between shrink-0 z-30">
        <div class="flex items-center gap-2">
          <!-- زر القائمة مع استدعاء دالة toggleIptvSidebar مباشرة -->
          <button type="button" onclick="toggleIptvSidebar()" class="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer">
            <i class="fa-solid fa-bars"></i> القائمة
          </button>
          <div class="flex items-center gap-1.5">
            <div class="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
              <i class="fa-solid fa-tv text-xs"></i>
            </div>
            <h1 class="font-bold text-xs text-white">IPTV Live</h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div id="iptvStatusBadge" class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span id="iptvStatusText">جاري التحميل...</span>
          </div>
          <button type="button" id="iptvReloadBtn" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 transition text-xs cursor-pointer" title="إعادة تحميل">
            <i class="fa-solid fa-rotate text-xs"></i>
          </button>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden relative">

        <!-- Sidebar Navigation (تبدأ مخفية وتعمل بالتبديل المباشر) -->
        <aside id="iptvSidebar" class="absolute md:relative inset-y-0 right-0 z-30 w-72 bg-[#151c2c] border-l border-[#232d42] flex flex-col shrink-0 overflow-y-auto transition-all duration-300 shadow-2xl" style="display: none;">
          <div class="p-3 border-b border-[#232d42] space-y-2">
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input type="text" id="iptvSearchInput" placeholder="ابحث عن قناة..." class="w-full bg-[#0b0f19] border border-[#232d42] focus:border-brand-500 rounded-lg py-1.5 pr-8 pl-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none">
            </div>

            <div class="grid grid-cols-2 gap-1 bg-[#0b0f19] p-1 rounded-lg border border-[#232d42]">
              <button type="button" id="iptvTabAll" class="py-1 text-[11px] font-semibold rounded bg-brand-600 text-white transition cursor-pointer">الكل (<span id="iptvCountAll">0</span>)</button>
              <button type="button" id="iptvTabFavs" class="py-1 text-[11px] font-semibold rounded text-gray-400 hover:text-white transition cursor-pointer">المفضلة (<span id="iptvCountFavs">0</span>)</button>
            </div>
          </div>

          <div class="p-3 border-b border-[#232d42] space-y-2">
            <div>
              <label class="text-[10px] font-semibold text-gray-400 block mb-1">التصنيف</label>
              <select id="iptvCategorySelect" class="w-full bg-[#0b0f19] border border-[#232d42] rounded-lg px-2.5 py-1.5 text-[11px] text-gray-200 focus:outline-none">
                <option value="">جميع التصنيفات</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-semibold text-gray-400 block mb-1">الدولة / المنطقة</label>
              <select id="iptvCountrySelect" class="w-full bg-[#0b0f19] border border-[#232d42] rounded-lg px-2.5 py-1.5 text-[11px] text-gray-200 focus:outline-none">
                <option value="">جميع الدول</option>
              </select>
            </div>
          </div>

          <div class="p-3 border-b border-[#232d42] bg-slate-900/40 flex items-center justify-between">
            <span class="text-[11px] font-semibold text-gray-300">خادم Proxy للبث</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="iptvUseProxyToggle" class="sr-only peer">
              <div class="w-7 h-3.5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div class="p-2.5 mt-auto text-center border-t border-[#232d42]">
            <p class="text-[11px] text-gray-500">إجمالي القنوات: <span id="iptvTotalChannelsCount" class="text-gray-300 font-bold">0</span></p>
          </div>
        </aside>

        <!-- Main Area (Player & Grid) -->
        <main class="flex-1 flex flex-col overflow-hidden bg-[#0b0f19] relative z-10">
          
          <!-- مشغل الفيديو العلوي -->
          <section class="w-full bg-black flex flex-col justify-center relative border-b border-[#232d42] shrink-0">
            <div class="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video id="iptvVideoPlayer" class="w-full h-full object-contain" controls crossorigin="anonymous"></video>

              <div id="iptvPlayerPlaceholder" class="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center z-10">
                <div class="w-12 h-12 rounded-xl bg-brand-600/25 border border-brand-500/30 flex items-center justify-center text-brand-500 mb-2">
                  <i class="fa-solid fa-play text-lg"></i>
                </div>
                <h3 class="text-sm font-bold text-white mb-1">اختر قناة للبدء بالتشغيل</h3>
                <p class="text-[11px] text-gray-400">اضغط على زر "القائمة" بالأعلى لعرض القنوات واختيار ما تحب.</p>
              </div>

              <div id="iptvVideoLoader" class="hidden absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <div class="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p class="text-xs text-gray-200 font-semibold" id="iptvLoaderText">جاري الاتصال بالبث...</p>
              </div>

              <div id="iptvVideoError" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10">
                <div class="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
                  <i class="fa-solid fa-triangle-exclamation text-lg"></i>
                </div>
                <h4 class="text-xs font-bold text-white mb-1">تعذر تشغيل هذا البث</h4>
                <p class="text-[11px] text-gray-400 mb-3" id="iptvErrorMessage">قد يكون البث غير متوفر حالياً.</p>
                <div class="flex gap-2">
                  <button type="button" id="iptvRetryStreamBtn" class="px-3 py-1.5 bg-brand-600 text-white text-[11px] font-semibold rounded-lg cursor-pointer">إعادة المحاولة</button>
                  <button type="button" id="iptvTryProxyBtn" class="px-3 py-1.5 bg-slate-800 text-gray-200 text-[11px] font-semibold rounded-lg cursor-pointer">التشغيل عبر Proxy</button>
                </div>
              </div>
            </div>

            <div class="p-2.5 bg-[#151c2c] border-t border-[#232d42] flex items-center justify-between">
              <div class="flex items-center gap-2 overflow-hidden">
                <img id="iptvActiveLogo" src="https://via.placeholder.com/40?text=TV" alt="logo" class="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-[#232d42] p-0.5 shrink-0" onerror="this.src='https://via.placeholder.com/40?text=TV'">
                <div class="truncate">
                  <h2 id="iptvActiveTitle" class="font-bold text-xs text-white truncate">لم يتم اختيار قناة</h2>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span id="iptvActiveGroup" class="text-[10px] px-1.5 py-0.5 bg-slate-800 text-gray-400 rounded">عام</span>
                    <span id="iptvActiveCountry" class="text-[10px] px-1.5 py-0.5 bg-slate-800 text-gray-400 rounded">عالمي</span>
                  </div>
                </div>
              </div>
              <button type="button" id="iptvFavCurrentBtn" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 transition shrink-0 cursor-pointer">
                <i class="fa-regular fa-star text-sm"></i>
              </button>
            </div>
          </section>

          <!-- قائمة القنوات السريعة -->
          <section class="flex-1 flex flex-col bg-[#0b0f19] overflow-hidden">
            <div class="p-2 bg-[#151c2c]/50 border-b border-[#232d42] flex items-center justify-between shrink-0">
              <span class="text-[11px] font-bold text-gray-300 flex items-center gap-1">
                <i class="fa-solid fa-list-ul text-brand-500"></i> القنوات المتاحة
              </span>
              <span id="iptvVisibleCountText" class="text-[11px] text-gray-400">عرض 0 قناة</span>
            </div>

            <div id="iptvChannelsContainer" class="flex-1 overflow-y-auto p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="col-span-full py-12 flex flex-col items-center justify-center text-center">
                <div class="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p class="text-xs font-semibold text-gray-300">جاري تجهيز القنوات بسلاسة...</p>
              </div>
            </div>
          </section>
        </main>

      </div>
    </div>
  `;

  modal.style.display = "flex";
  setTimeout(() => initIptvPlayerLogic(), 100);
}

// دالة فتح وإغلاق القائمة المتاحة عالمياً للزر المباشر
function toggleIptvSidebar() {
  const sidebar = document.getElementById("iptvSidebar");
  if (sidebar) {
    if (sidebar.style.display === "none" || sidebar.style.display === "") {
      sidebar.style.display = "flex";
    } else {
      sidebar.style.display = "none";
    }
  }
}

window.openIptvService = openIptvService;
window.toggleIptvSidebar = toggleIptvSidebar;

document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("iptvToolCard");
  if (card) {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openIptvService();
    });
  }
});

function initIptvPlayerLogic() {
  let allChannels = [];
  let filteredChannels = [];
  let favoriteIds = JSON.parse(localStorage.getItem('iptv_favorites') || '[]');
  let currentChannel = null;
  let hlsInstance = null;
  let activeTab = 'all';
  let useProxyForStream = false;

  const CORS_PROXIES = ['https://corsproxy.io/?', 'https://api.allorigins.win/raw?url='];
  const M3U_URL = 'https://iptv-org.github.io/iptv/index.m3u';

  const videoPlayer = document.getElementById('iptvVideoPlayer');
  const channelsContainer = document.getElementById('iptvChannelsContainer');
  const searchInput = document.getElementById('iptvSearchInput');
  const categorySelect = document.getElementById('iptvCategorySelect');
  const countrySelect = document.getElementById('iptvCountrySelect');
  const statusBadge = document.getElementById('iptvStatusBadge');
  const statusText = document.getElementById('iptvStatusText');
  const countAll = document.getElementById('iptvCountAll');
  const countFavs = document.getElementById('iptvCountFavs');
  const totalChannelsCount = document.getElementById('iptvTotalChannelsCount');
  const visibleCountText = document.getElementById('iptvVisibleCountText');
  const tabAll = document.getElementById('iptvTabAll');
  const tabFavs = document.getElementById('iptvTabFavs');
  const reloadPlaylistBtn = document.getElementById('iptvReloadBtn');
  const useProxyToggle = document.getElementById('iptvUseProxyToggle');

  const playerPlaceholder = document.getElementById('iptvPlayerPlaceholder');
  const videoLoader = document.getElementById('iptvVideoLoader');
  const loaderText = document.getElementById('iptvLoaderText');
  const videoError = document.getElementById('iptvVideoError');
  const errorMessage = document.getElementById('iptvErrorMessage');
  const retryStreamBtn = document.getElementById('iptvRetryStreamBtn');
  const tryProxyBtn = document.getElementById('iptvTryProxyBtn');
  
  const activeLogo = document.getElementById('iptvActiveLogo');
  const activeTitle = document.getElementById('iptvActiveTitle');
  const activeGroup = document.getElementById('iptvActiveGroup');
  const activeCountry = document.getElementById('iptvActiveCountry');
  const favCurrentBtn = document.getElementById('iptvFavCurrentBtn');

  if (!videoPlayer) return;

  setupEvents();
  loadPlaylistData();

  function setupEvents() {
    reloadPlaylistBtn.addEventListener('click', () => loadPlaylistData(true));
    useProxyToggle.addEventListener('change', (e) => {
      useProxyForStream = e.target.checked;
      if (currentChannel) playChannel(currentChannel);
    });

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => filterAndRender(), 200);
    });

    categorySelect.addEventListener('change', filterAndRender);
    countrySelect.addEventListener('change', filterAndRender);

    tabAll.addEventListener('click', () => switchTab('all'));
    tabFavs.addEventListener('click', () => switchTab('favs'));

    favCurrentBtn.addEventListener('click', () => {
      if (currentChannel) {
        toggleFav(currentChannel.id);
        updateFavUI();
      }
    });

    retryStreamBtn.addEventListener('click', () => {
      if (currentChannel) playChannel(currentChannel);
    });

    tryProxyBtn.addEventListener('click', () => {
      useProxyForStream = true;
      useProxyToggle.checked = true;
      if (currentChannel) playChannel(currentChannel);
    });
  }

  async function loadPlaylistData() {
    updateStatus('جاري التحميل...', 'amber');
    channelsContainer.innerHTML = `
      <div class="col-span-full py-12 flex flex-col items-center justify-center text-center">
        <div class="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p class="text-xs font-semibold text-gray-300">جاري جلب القنوات...</p>
      </div>
    `;

    try {
      let m3uText = await fetchM3UData(M3U_URL);
      allChannels = parseM3UData(m3uText);

      if (allChannels.length === 0) throw new Error('لا توجد قنوات.');

      populateFiltersData(allChannels);
      updateGlobalCounts();
      filterAndRender();
      updateStatus(`جاهز (${allChannels.length})`, 'emerald');

    } catch (err) {
      updateStatus('فشل التحميل', 'red');
      channelsContainer.innerHTML = `
        <div class="col-span-full py-10 flex flex-col items-center justify-center text-center px-3 text-xs text-red-400">
          <p>تعذر تحميل القنوات، تأكد من الاتصال.</p>
        </div>
      `;
    }
  }

  async function fetchM3UData(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return await res.text();
    } catch (e) {
      for (const proxy of CORS_PROXIES) {
        try {
          const res = await fetch(proxy + encodeURIComponent(url));
          if (res.ok) return await res.text();
        } catch (err) {}
      }
      throw new Error();
    }
  }

  function parseM3UData(content) {
    const lines = content.split('\n');
    const channels = [];
    let cur = null;
    let idCount = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        const logoM = line.match(/tvg-logo="([^"]*)"/i);
        const groupM = line.match(/group-title="([^"]*)"/i);
        const cntM = line.match(/tvg-country="([^"]*)"/i);
        const commaIdx = line.lastIndexOf(',');
        const name = commaIdx !== -1 ? line.substring(commaIdx + 1).trim() : 'قناة';

        cur = {
          id: 'iptv_c_' + (idCount++),
          name: name,
          logo: logoM ? logoM[1] : '',
          group: groupM ? groupM[1] : 'عام',
          country: cntM ? cntM[1] : 'عالمي'
        };
      } else if (line.length > 0 && !line.startsWith('#') && cur) {
        cur.url = line;
        channels.push(cur);
        cur = null;
      }
    }
    return channels;
  }

  function populateFiltersData(channels) {
    const categories = new Set();
    const countries = new Set();
    channels.forEach(ch => {
      if (ch.group) categories.add(ch.group);
      if (ch.country) countries.add(ch.country);
    });

    categorySelect.innerHTML = '<option value="">جميع التصنيفات</option>';
    Array.from(categories).sort().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat;
      categorySelect.appendChild(opt);
    });

    countrySelect.innerHTML = '<option value="">جميع الدول</option>';
    Array.from(countries).sort().forEach(cnt => {
      const opt = document.createElement('option');
      opt.value = cnt; opt.textContent = cnt;
      countrySelect.appendChild(opt);
    });
  }

  function filterAndRender() {
    const term = searchInput.value.toLowerCase().trim();
    const cat = categorySelect.value;
    const cnt = countrySelect.value;

    filteredChannels = allChannels.filter(ch => {
      const matchSearch = !term || ch.name.toLowerCase().includes(term) || ch.group.toLowerCase().includes(term);
      const matchCat = !cat || ch.group === cat;
      const matchCnt = !cnt || ch.country === cnt;
      const matchFav = activeTab !== 'favs' || favoriteIds.includes(ch.id);
      return matchSearch && matchCat && matchCnt && matchFav;
    });

    renderGrid(filteredChannels.slice(0, 150));
    visibleCountText.textContent = `عرض ${filteredChannels.length} قناة`;
  }

  function renderGrid(channels) {
    if (channels.length === 0) {
      channelsContainer.innerHTML = `
        <div class="col-span-full py-10 flex flex-col items-center justify-center text-center text-gray-400 text-xs">
          <p>لا توجد قنوات مطابقة</p>
        </div>
      `;
      return;
    }

    channelsContainer.innerHTML = channels.map(ch => {
      const isFav = favoriteIds.includes(ch.id);
      const isActive = currentChannel && currentChannel.id === ch.id;

      return `
        <div onclick="window.selectIptvChannelItem('${ch.id}')" class="group relative bg-[#151c2c] border ${isActive ? 'border-brand-500 bg-brand-600/15' : 'border-[#232d42] hover:border-slate-600'} rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition">
          <img src="${ch.logo}" alt="" class="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-[#232d42] p-0.5 shrink-0" onerror="this.src='https://via.placeholder.com/32?text=TV'">
          
          <div class="flex-1 overflow-hidden">
            <h4 class="font-bold text-[11px] text-white truncate ${isActive ? 'text-brand-400' : ''}">${escapeHtml(ch.name)}</h4>
            <span class="text-[9px] text-gray-400 block truncate mt-0.5">${escapeHtml(ch.group)}</span>
          </div>

          <button type="button" onclick="event.stopPropagation(); window.toggleIptvFavItem('${ch.id}')" class="p-1 text-gray-500 hover:text-amber-400 transition cursor-pointer">
            <i class="${isFav ? 'fa-solid fa-star text-amber-400' : 'fa-regular fa-star'} text-xs"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  window.selectIptvChannelItem = function(id) {
    const channel = allChannels.find(c => c.id === id);
    if (!channel) return;

    currentChannel = channel;
    activeTitle.textContent = channel.name;
    activeGroup.textContent = channel.group;
    activeCountry.textContent = channel.country;
    activeLogo.src = channel.logo || 'https://via.placeholder.com/40?text=TV';
    updateFavUI();
    filterAndRender();
    playChannel(channel);

    const sidebar = document.getElementById("iptvSidebar");
    if (sidebar) {
      sidebar.style.display = 'none';
    }
  };

  window.toggleIptvFavItem = function(id) {
    toggleFav(id);
  };

  function playChannel(channel) {
    playerPlaceholder.classList.add('hidden');
    videoError.classList.add('hidden');
    videoLoader.classList.remove('hidden');
    loaderText.textContent = 'جاري الاتصال بالبث...';

    let streamUrl = channel.url;
    if (useProxyForStream) streamUrl = CORS_PROXIES[0] + encodeURIComponent(streamUrl);

    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(videoPlayer);

      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
        videoLoader.classList.add('hidden');
        videoPlayer.play().catch(e => console.warn('Autoplay prevented:', e));
      });

      hlsInstance.on(window.Hls.Events.ERROR, (event, data) => {
        if (data.fatal) showVideoErr('فشل الاتصال بشبكة البث.');
      });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
      videoPlayer.src = streamUrl;
      videoPlayer.addEventListener('loadedmetadata', () => {
        videoLoader.classList.add('hidden');
        videoPlayer.play();
      });
    } else {
      showVideoErr('المتصفح لا يدعم هذا النوع.');
    }
  }

  function showVideoErr(msg) {
    videoLoader.classList.add('hidden');
    videoError.classList.remove('hidden');
    errorMessage.textContent = msg;
  }

  function toggleFav(id) {
    if (favoriteIds.includes(id)) {
      favoriteIds = favoriteIds.filter(f => f !== id);
    } else {
      favoriteIds.push(id);
    }
    localStorage.setItem('iptv_favorites', JSON.stringify(favoriteIds));
    updateGlobalCounts();
    filterAndRender();
    updateFavUI();
  }

  function switchTab(tab) {
    activeTab = tab;
    if (tab === 'all') {
      tabAll.className = 'py-1 text-[11px] font-semibold rounded bg-brand-600 text-white transition cursor-pointer';
      tabFavs.className = 'py-1 text-[11px] font-semibold rounded text-gray-400 hover:text-white transition cursor-pointer';
    } else {
      tabFavs.className = 'py-1 text-[11px] font-semibold rounded bg-brand-600 text-white transition cursor-pointer';
      tabAll.className = 'py-1 text-[11px] font-semibold rounded text-gray-400 hover:text-white transition cursor-pointer';
    }
    filterAndRender();
  }

  function updateGlobalCounts() {
    countAll.textContent = allChannels.length;
    countFavs.textContent = favoriteIds.length;
    totalChannelsCount.textContent = allChannels.length;
  }

  function updateFavUI() {
    if (!currentChannel) return;
    const isFav = favoriteIds.includes(currentChannel.id);
    favCurrentBtn.innerHTML = `<i class="${isFav ? 'fa-solid fa-star text-amber-400' : 'fa-regular fa-star'} text-sm"></i>`;
  }

  function updateStatus(text, color) {
    statusText.textContent = text;
    if (color === 'emerald') {
      statusBadge.className = 'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    } else if (color === 'red') {
      statusBadge.className = 'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20';
    } else {
      statusBadge.className = 'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
 

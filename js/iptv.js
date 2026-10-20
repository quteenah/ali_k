// ==========================================
// أداة مشغل القنوات الذكي (Ali-K IPTV Player)
// ==========================================

window.openIptvService = function () {
  const iptvHtml = `
    <div style="display: flex; flex-direction: column; gap: 12px; font-family: 'Cairo', sans-serif; direction: rtl; color: #f1f5f9; text-align: right; max-height: 80vh; overflow-y: auto; padding: 4px;">
      
      <!-- شريط البحث والتحكم العلوي -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; justify-content: space-between; background: rgba(18, 24, 38, 0.75); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
        <div style="position: relative; flex: 1; min-width: 200px;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem;"></i>
          <input type="text" id="iptvSearchInput" oninput="window.iptvOnSearch()" placeholder="بحث عن قناة..." 
            style="width: 100%; padding: 8px 36px 8px 12px; border-radius: 8px; background: #090d16; border: 1px solid #334155; color: #fff; font-size: 0.85rem; outline: none; box-sizing: border-box;" />
        </div>
        <div style="display: flex; gap: 6px;">
          <button onclick="window.loadIptvPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'العربية')" style="padding: 8px 12px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-size: 0.75rem; cursor: pointer; font-weight: bold;">قنوات عربية</button>
          <button onclick="window.loadIptvPreset('https://iptv-org.github.io/iptv/categories/sport.m3u', 'الرياضة')" style="padding: 8px 12px; background: #1e293b; color: #38bdf8; border: 1px solid #334155; border-radius: 8px; font-size: 0.75rem; cursor: pointer;">رياضة</button>
        </div>
      </div>

      <!-- شبكة العرض (المشغل والقنوات) -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 12px;" class="iptv-grid-layout">
        
        <!-- مشغل الفيديو -->
        <div style="position: relative; background: #000; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center;">
          <video id="iptvVideoPlayer" style="width: 100%; height: 100%; object-fit: contain; display: none;" playsinline controls></video>
          <iframe id="iptvIframePlayer" style="width: 100%; height: 100%; border: none; display: none;" allowfullscreen allow="autoplay; encrypted-media"></iframe>
          
          <div id="iptvOverlay" style="position: absolute; inset: 0; background: rgba(9, 13, 22, 0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 15px; z-index: 10;">
            <i class="fa-solid fa-tv" style="font-size: 2.5rem; color: #3b82f6;"></i>
            <p id="iptvOverlayText" style="font-size: 0.9rem; font-weight: bold; color: #e2e8f0; margin: 0;">اختر قناة من القائمة أدناه لبدء البث</p>
          </div>
        </div>

        <!-- قائمة القنوات المنسدلة -->
        <div style="background: rgba(18, 24, 38, 0.6); border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.08); max-height: 250px; overflow-y: auto;" id="iptvChannelsContainer">
          <div style="text-align: center; color: #94a3b8; font-size: 0.8rem; padding: 20px;">جاري تحميل القنوات...</div>
        </div>

      </div>
    </div>
  `;

  if (window.openServiceModal) {
    window.openServiceModal("📺 مشغل IPTV المباشر", iptvHtml, false);
  }

  // تحميل مكتبة HLS إذا لم تكن موجودة وتشغيل القوائم الافتراضية
  if (!window.Hls) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => window.loadIptvPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'العربية');
    document.head.appendChild(script);
  } else {
    window.loadIptvPreset('https://iptv-org.github.io/iptv/languages/ar.m3u', 'العربية');
  }
};

let iptvChannels = [];
let iptvFiltered = [];
let iptvHlsInstance = null;

window.loadIptvPreset = async function(url) {
  const container = document.getElementById('iptvChannelsContainer');
  if (!container) return;
  container.innerHTML = '<div style="text-align: center; color: #3b82f6; font-size: 0.8rem; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> جاري جلب القنوات...</div>';

  try {
    const res = await fetch(url);
    const text = await res.text();
    iptvChannels = window.parseM3UText(text);
    iptvFiltered = iptvChannels;
    window.renderIptvList();
    if (iptvChannels.length > 0) window.playIptvChannel(iptvChannels[0]);
  } catch (e) {
    container.innerHTML = '<div style="text-align: center; color: #ef4444; font-size: 0.8rem; padding: 20px;">فشل تحميل القنوات. تحقق من الاتصال.</div>';
  }
};

window.parseM3UText = function(m3uText) {
  const lines = m3uText.split('\n');
  const channels = [];
  let current = null;
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF:')) {
      current = {};
      const comma = line.lastIndexOf(',');
      current.name = comma !== -1 ? line.substring(comma + 1).trim() : 'قناة';
      const logo = line.match(/tvg-logo="([^"]+)"/);
      current.logo = logo ? logo[1] : '';
    } else if (line && !line.startsWith('#') && current) {
      current.url = line;
      channels.push(current);
      current = null;
    }
  }
  return channels;
};

window.renderIptvList = function() {
  const container = document.getElementById('iptvChannelsContainer');
  if (!container) return;

  if (iptvFiltered.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #94a3b8; font-size: 0.8rem; padding: 20px;">لا توجد قنوات مطابقة</div>';
    return;
  }

  container.innerHTML = iptvFiltered.map((ch, idx) => `
    <div onclick="window.playIptvChannelByIndex(${idx})" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; margin-bottom: 6px; background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 8px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#3b82f6'" onmouseout="this.style.borderColor='#1e293b'">
      <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
        <div style="width: 28px; height: 28px; background: #090d16; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
          ${ch.logo ? `<img src="${ch.logo}" style="width:100%; height:100%; object-fit:contain;" onerror="this.remove()">` : '<i class="fa-solid fa-tv" style="font-size:0.7rem; color:#64748b;"></i>'}
        </div>
        <span style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ch.name}</span>
      </div>
      <i class="fa-solid fa-play" style="font-size: 0.7rem; color: #3b82f6;"></i>
    </div>
  `).join('');
};

window.playIptvChannelByIndex = function(index) {
  window.playIptvChannel(iptvFiltered[index]);
};

window.playIptvChannel = function(ch) {
  const video = document.getElementById('iptvVideoPlayer');
  const iframe = document.getElementById('iptvIframePlayer');
  const overlay = document.getElementById('iptvOverlay');
  if (!video || !iframe || !overlay) return;

  overlay.style.display = 'none';
  video.style.display = 'none';
  iframe.style.display = 'none';

  if (iptvHlsInstance) {
    iptvHlsInstance.destroy();
    iptvHlsInstance = null;
  }

  if (ch.url.includes('youtube.com') || ch.url.includes('embed')) {
    iframe.src = ch.url;
    iframe.style.display = 'block';
  } else {
    video.style.display = 'block';
    if (window.Hls && window.Hls.isSupported() && (ch.url.includes('.m3u8') || !ch.url.includes('.'))) {
      iptvHlsInstance = new window.Hls();
      iptvHlsInstance.loadSource(ch.url);
      iptvHlsInstance.attachMedia(video);
      iptvHlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => video.play().catch(()=>{}));
    } else {
      video.src = ch.url;
      video.play().catch(()=>{});
    }
  }
};

window.iptvOnSearch = function() {
  const query = document.getElementById('iptvSearchInput').value.toLowerCase();
  iptvFiltered = iptvChannels.filter(ch => ch.name.toLowerCase().includes(query));
  window.renderIptvList();
};

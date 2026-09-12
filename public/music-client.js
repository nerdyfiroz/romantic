// ============================================================================
// Dynamic Romantic Background Music Selection & Recipient Experience Engine
// ============================================================================

(function () {
  "use strict";

  const API_BASE = (
    window.location.origin.includes("appassets.androidplatform.net") ||
    window.location.protocol === "file:" ||
    (window.location.hostname === "localhost" && window.location.port === "5000")
  ) ? "https://romantic-beige.vercel.app" : "";

  // State
  let currentMusicConfig = null;
  let categoriesCache = [];
  let tracksCache = [];
  let activeCategory = "all";
  let activeSearchQuery = "";
  let searchDebounceTimer = null;

  // Audio Players
  let previewAudioPlayer = null;
  let previewingTrackId = null;
  let recipientAudioPlayer = null;
  let isRecipientPlaying = false;
  let recipientAudioStarted = false;
  let isMuted = false;
  let preMuteVolume = 0.35;

  // DOM Elements - Customizer Section
  const noMusicSelectedView = document.getElementById("noMusicSelectedView");
  const selectedMusicView = document.getElementById("selectedMusicView");
  const openMusicPickerBtn = document.getElementById("openMusicPickerBtn");
  const selectedMusicDiscIcon = document.getElementById("selectedMusicDiscIcon");
  const selectedMusicTitle = document.getElementById("selectedMusicTitle");
  const selectedMusicCategoryBadge = document.getElementById("selectedMusicCategoryBadge");
  const selectedMusicArtist = document.getElementById("selectedMusicArtist");
  const selectedMusicDuration = document.getElementById("selectedMusicDuration");
  const viewSelectedLicenseBtn = document.getElementById("viewSelectedLicenseBtn");
  const previewSelectedMusicBtn = document.getElementById("previewSelectedMusicBtn");
  const previewSelectedIcon = document.getElementById("previewSelectedIcon");
  const changeMusicBtn = document.getElementById("changeMusicBtn");
  const removeMusicBtn = document.getElementById("removeMusicBtn");

  // DOM Elements - Customizer Drawer
  const musicCustomizationDrawer = document.getElementById("musicCustomizationDrawer");
  const musicVolumeInput = document.getElementById("musicVolumeInput");
  const musicVolumeVal = document.getElementById("musicVolumeVal");
  const musicLoopCheckbox = document.getElementById("musicLoopCheckbox");
  const musicLoopVal = document.getElementById("musicLoopVal");
  const musicStartTimeInput = document.getElementById("musicStartTimeInput");
  const musicStartTimeVal = document.getElementById("musicStartTimeVal");
  const musicFadeInInput = document.getElementById("musicFadeInInput");
  const musicFadeInVal = document.getElementById("musicFadeInVal");
  const musicAttributionDisplay = document.getElementById("musicAttributionDisplay");
  const musicAttributionText = document.getElementById("musicAttributionText");

  // DOM Elements - Music Picker Modal
  const musicPickerModal = document.getElementById("musicPickerModal");
  const musicPickerBackdrop = document.getElementById("musicPickerBackdrop");
  const closeMusicPickerBtn = document.getElementById("closeMusicPickerBtn");
  const closePickerDoneBtn = document.getElementById("closePickerDoneBtn");
  const musicSearchInput = document.getElementById("musicSearchInput");
  const clearMusicSearchBtn = document.getElementById("clearMusicSearchBtn");
  const executeMusicSearchBtn = document.getElementById("executeMusicSearchBtn");
  const musicCategoriesBar = document.getElementById("musicCategoriesBar");
  const musicTracksCount = document.getElementById("musicTracksCount");
  const musicTracksList = document.getElementById("musicTracksList");
  const musicPreviewStatusBar = document.getElementById("musicPreviewStatusBar");
  const musicPreviewStatusText = document.getElementById("musicPreviewStatusText");

  // DOM Elements - License Modal
  const licenseInfoModal = document.getElementById("licenseInfoModal");
  const licenseModalBackdrop = document.getElementById("licenseModalBackdrop");
  const closeLicenseModalBtn = document.getElementById("closeLicenseModalBtn");
  const dismissLicenseModalBtn = document.getElementById("dismissLicenseModalBtn");
  const licenseModalContent = document.getElementById("licenseModalContent");

  // DOM Elements - Recipient Music Widget & Tap Prompt
  const recipientMusicWidget = document.getElementById("recipientMusicWidget");
  const recipientMusicPlayBtn = document.getElementById("recipientMusicPlayBtn");
  const recipientPlayIcon = document.getElementById("recipientPlayIcon");
  const recipientTrackTitle = document.getElementById("recipientTrackTitle");
  const recipientTrackArtist = document.getElementById("recipientTrackArtist");
  const recipientLicenseBtn = document.getElementById("recipientLicenseBtn");
  const recipientMuteBtn = document.getElementById("recipientMuteBtn");
  const recipientVolSlider = document.getElementById("recipientVolSlider");
  const recipientMusicTapPrompt = document.getElementById("recipientMusicTapPrompt");
  const recipientPromptText = document.getElementById("recipientPromptText");
  const dismissMusicPromptBtn = document.getElementById("dismissMusicPromptBtn");

  // Helper: Toast notification
  function toast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
    }
  }

  // ==========================================================================
  // 1. DATA FETCHING: CATEGORIES & TRACK SEARCH
  // ==========================================================================
  async function fetchCategories() {
    if (categoriesCache.length > 0) return categoriesCache;
    try {
      const res = await fetch(`${API_BASE}/api/music/categories`);
      if (res.ok) {
        const data = await res.json();
        categoriesCache = data.categories || [];
        renderCategoryPills(categoriesCache);
        return categoriesCache;
      }
    } catch (e) {
      console.warn("Failed to fetch music categories:", e);
    }
    return [];
  }

  async function fetchTracks(category = "all", query = "") {
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (query && query.trim()) params.set("q", query.trim());

      const res = await fetch(`${API_BASE}/api/music/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        tracksCache = data.tracks || [];
        renderTrackList(tracksCache);
        return tracksCache;
      }
    } catch (e) {
      console.warn("Failed to fetch music tracks:", e);
    }
    renderTrackList([]);
    return [];
  }

  // ==========================================================================
  // 2. PICKER MODAL UI: CATEGORIES & TRACK LIST RENDERING
  // ==========================================================================
  function renderCategoryPills(categories) {
    if (!musicCategoriesBar) return;
    musicCategoriesBar.innerHTML = "";

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `category-pill ${cat.id === activeCategory ? "active" : ""}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat.id === activeCategory ? "true" : "false");
      btn.innerHTML = `<span>${cat.icon || "🎵"}</span> <span>${cat.label}</span>`;
      btn.addEventListener("click", () => {
        activeCategory = cat.id;
        document.querySelectorAll(".category-pill").forEach((p) => {
          p.classList.remove("active");
          p.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        fetchTracks(activeCategory, activeSearchQuery);
      });
      musicCategoriesBar.appendChild(btn);
    });
  }

  function renderTrackList(tracks) {
    if (!musicTracksList) return;
    musicTracksList.innerHTML = "";

    if (musicTracksCount) {
      const count = tracks.length;
      musicTracksCount.textContent = count === 1 ? "1 melody found" : `${count} melodies found`;
    }

    if (!tracks || tracks.length === 0) {
      musicTracksList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #b7a9ce;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎼</div>
          <strong style="color: #fff; display: block; margin-bottom: 4px;">No matching melodies found</strong>
          <p style="font-size: 12px; margin: 0;">Try searching for "piano", "wedding", "bangla", "spiritual", or "romantic".</p>
        </div>
      `;
      return;
    }

    tracks.forEach((track) => {
      const isSelected = currentMusicConfig && currentMusicConfig.track_id === track.track_id;
      const isPlaying = previewingTrackId === track.track_id;

      const card = document.createElement("div");
      card.className = `track-card ${isSelected ? "selected" : ""}`;
      card.setAttribute("data-track-id", track.track_id);

      card.innerHTML = `
        <div class="track-card-main">
          <button type="button" class="track-preview-btn ${isPlaying ? "playing" : ""}" data-track-id="${track.track_id}" title="${isPlaying ? "Pause Preview" : "Preview Melody"}" aria-label="Preview track">
            <span>${isPlaying ? "⏸" : "▶"}</span>
          </button>
          <div class="track-info">
            <div class="track-headline">
              <span class="track-title">${escapeHtml(track.title)}</span>
              <span class="track-category-tag">${escapeHtml(track.category || "romantic")}</span>
            </div>
            <div class="track-byline">
              <span class="track-artist">${escapeHtml(track.artist)}</span>
              <span class="music-dot">•</span>
              <span class="track-duration">${track.duration_formatted || "2:30"}</span>
              <span class="music-dot">•</span>
              <button type="button" class="track-license-badge" data-track-id="${track.track_id}">License ⓘ</button>
            </div>
            <p class="track-desc">${escapeHtml(track.description || "Romantic background melody for proposal moments.")}</p>
          </div>
        </div>
        <div class="track-actions">
          <button type="button" class="track-select-btn ${isSelected ? "selected" : ""}" data-track-id="${track.track_id}">
            ${isSelected ? "✓ Selected" : "Use This Track"}
          </button>
        </div>
      `;

      // Preview click
      const previewBtn = card.querySelector(".track-preview-btn");
      previewBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleTrackPreview(track);
      });

      // License click
      const licenseBtn = card.querySelector(".track-license-badge");
      licenseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLicenseModal(track);
      });

      // Select click
      const selectBtn = card.querySelector(".track-select-btn");
      selectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectMusicTrack(track);
      });

      musicTracksList.appendChild(card);
    });
  }

  // ==========================================================================
  // 3. SINGLE AUDIO PREVIEW PLAYER (Ensures ONLY ONE preview at a time)
  // ==========================================================================
  function stopPreview() {
    if (previewAudioPlayer) {
      try {
        previewAudioPlayer.pause();
        previewAudioPlayer.currentTime = 0;
      } catch (_) {}
      previewAudioPlayer = null;
    }
    previewingTrackId = null;
    updateAllPreviewIcons();
    if (musicPreviewStatusText) {
      musicPreviewStatusText.textContent = "Click 'Preview' to listen. Only one preview plays at a time.";
    }
  }

  function toggleTrackPreview(track) {
    // If already playing this track, pause it
    if (previewingTrackId === track.track_id) {
      stopPreview();
      return;
    }

    // Stop any existing preview first
    stopPreview();

    // Also ensure recipient player is paused if active
    if (recipientAudioPlayer && !recipientAudioPlayer.paused) {
      try { recipientAudioPlayer.pause(); } catch (_) {}
      updateRecipientMusicUI(false);
    }

    const audioUrl = track.stream_url || `${API_BASE}/api/music/stream/${track.track_id}`;
    previewAudioPlayer = new Audio();
    previewingTrackId = track.track_id;
    previewAudioPlayer.src = audioUrl;
    previewAudioPlayer.volume = currentMusicConfig && typeof currentMusicConfig.volume === "number" ? currentMusicConfig.volume : 0.4;

    // Fallback directly to CDN url if stream proxy has an issue
    previewAudioPlayer.onerror = () => {
      if (track.audio_url && previewAudioPlayer.src !== track.audio_url) {
        console.warn("Retrying preview with direct CDN url:", track.audio_url);
        previewAudioPlayer.src = track.audio_url;
        previewAudioPlayer.play().catch(() => stopPreview());
      } else {
        stopPreview();
        toast("⚠️ Audio preview could not be loaded.");
      }
    };

    previewAudioPlayer.onended = () => {
      stopPreview();
    };

    updateAllPreviewIcons();
    if (musicPreviewStatusText) {
      musicPreviewStatusText.textContent = `▶ Now playing preview: ${track.title} by ${track.artist}`;
    }

    previewAudioPlayer.play().catch((err) => {
      console.warn("Audio play prevented:", err);
      stopPreview();
    });
  }

  function updateAllPreviewIcons() {
    // Update track cards in picker list
    document.querySelectorAll(".track-preview-btn").forEach((btn) => {
      const trackId = btn.getAttribute("data-track-id");
      const isPlaying = previewingTrackId === trackId;
      btn.classList.toggle("playing", isPlaying);
      const span = btn.querySelector("span");
      if (span) span.textContent = isPlaying ? "⏸" : "▶";
    });

    // Update preview button in customizer
    if (previewSelectedMusicBtn && previewSelectedIcon) {
      const isCustomizerPlaying = previewingTrackId === (currentMusicConfig && currentMusicConfig.track_id);
      previewSelectedMusicBtn.classList.toggle("active", isCustomizerPlaying);
      previewSelectedIcon.textContent = isCustomizerPlaying ? "⏸" : "▶";
      if (selectedMusicDiscIcon) {
        selectedMusicDiscIcon.classList.toggle("playing", isCustomizerPlaying);
      }
    }
  }

  // ==========================================================================
  // 4. MUSIC SELECTION & CUSTOMIZATION
  // ==========================================================================
  function selectMusicTrack(track) {
    const existingVolume = currentMusicConfig && typeof currentMusicConfig.volume === "number" ? currentMusicConfig.volume : 0.35;
    const existingLoop = currentMusicConfig && typeof currentMusicConfig.loop === "boolean" ? currentMusicConfig.loop : true;
    const existingStartTime = currentMusicConfig && typeof currentMusicConfig.start_time === "number" ? currentMusicConfig.start_time : 0;
    const existingFadeIn = currentMusicConfig && typeof currentMusicConfig.fade_in === "number" ? currentMusicConfig.fade_in : 3;

    currentMusicConfig = {
      track_id: track.track_id,
      title: track.title,
      artist: track.artist,
      category: track.category || "romantic",
      duration: track.duration,
      duration_formatted: track.duration_formatted,
      audio_url: track.audio_url,
      stream_url: track.stream_url || `${API_BASE}/api/music/stream/${track.track_id}`,
      source: track.source || "Licensed Catalog",
      source_url: track.source_url || "",
      license: track.license || "Creative Commons",
      license_url: track.license_url || "",
      attribution_required: track.attribution_required !== false,
      attribution_text: track.attribution_text || `${track.title} by ${track.artist}`,
      volume: existingVolume,
      loop: existingLoop,
      start_time: existingStartTime,
      fade_in: existingFadeIn
    };

    // Stop any active preview
    stopPreview();

    // Close picker modal
    closeMusicPicker();

    // Sync Customizer UI
    syncMusicCustomizerUI();

    toast(`🎵 Background music selected: ${track.title}`);
  }

  function removeMusicTrack() {
    stopPreview();
    currentMusicConfig = null;
    syncMusicCustomizerUI();
    toast("Background music removed.");
  }

  function syncMusicCustomizerUI() {
    if (!noMusicSelectedView || !selectedMusicView) return;

    if (!currentMusicConfig || !currentMusicConfig.track_id) {
      noMusicSelectedView.hidden = false;
      selectedMusicView.hidden = true;
      if (musicCustomizationDrawer) musicCustomizationDrawer.hidden = true;
      return;
    }

    noMusicSelectedView.hidden = true;
    selectedMusicView.hidden = false;

    if (selectedMusicTitle) selectedMusicTitle.textContent = currentMusicConfig.title;
    if (selectedMusicCategoryBadge) selectedMusicCategoryBadge.textContent = currentMusicConfig.category || "Romantic";
    if (selectedMusicArtist) selectedMusicArtist.textContent = currentMusicConfig.artist;
    if (selectedMusicDuration) selectedMusicDuration.textContent = currentMusicConfig.duration_formatted || "2:30";

    if (musicCustomizationDrawer) {
      musicCustomizationDrawer.hidden = false;

      if (musicVolumeInput) {
        musicVolumeInput.value = currentMusicConfig.volume ?? 0.35;
        if (musicVolumeVal) musicVolumeVal.textContent = `${Math.round((currentMusicConfig.volume ?? 0.35) * 100)}%`;
      }
      if (musicLoopCheckbox) {
        musicLoopCheckbox.checked = currentMusicConfig.loop !== false;
        if (musicLoopVal) musicLoopVal.textContent = musicLoopCheckbox.checked ? "ON" : "OFF";
      }
      if (musicStartTimeInput) {
        musicStartTimeInput.value = currentMusicConfig.start_time ?? 0;
        if (musicStartTimeVal) musicStartTimeVal.textContent = `${currentMusicConfig.start_time ?? 0}s`;
      }
      if (musicFadeInInput) {
        musicFadeInInput.value = currentMusicConfig.fade_in ?? 3;
        if (musicFadeInVal) musicFadeInVal.textContent = `${currentMusicConfig.fade_in ?? 3}s`;
      }

      if (musicAttributionDisplay && musicAttributionText) {
        if (currentMusicConfig.attribution_text) {
          musicAttributionDisplay.hidden = false;
          musicAttributionText.textContent = `Music: ${currentMusicConfig.attribution_text}`;
        } else {
          musicAttributionDisplay.hidden = true;
        }
      }
    }
  }

  // ==========================================================================
  // 5. PICKER MODAL OPEN & CLOSE
  // ==========================================================================
  function openMusicPicker() {
    fetchCategories();
    fetchTracks(activeCategory, activeSearchQuery);
    if (musicPickerModal) musicPickerModal.hidden = false;
    setTimeout(() => {
      if (musicSearchInput) musicSearchInput.focus();
    }, 100);
  }

  function closeMusicPicker() {
    stopPreview();
    if (musicPickerModal) musicPickerModal.hidden = true;
  }

  // ==========================================================================
  // 6. LICENSE MODAL DISPLAY
  // ==========================================================================
  function openLicenseModal(track) {
    if (!licenseInfoModal || !licenseModalContent) return;
    const target = track || currentMusicConfig;
    if (!target) return;

    licenseModalContent.innerHTML = `
      <div class="license-field-row">
        <span class="license-field-label">Track Title &amp; Artist</span>
        <span class="license-field-value">${escapeHtml(target.title)} — ${escapeHtml(target.artist)}</span>
      </div>

      <div class="license-field-row">
        <span class="license-field-label">Licensed Source</span>
        <span class="license-field-value">
          ${escapeHtml(target.source || "Licensed Library")}
          ${target.source_url ? `• <a href="${escapeHtml(target.source_url)}" target="_blank" rel="noopener noreferrer">Original Catalog Page ↗</a>` : ""}
        </span>
      </div>

      <div class="license-field-row">
        <span class="license-field-label">Official License Terms</span>
        <span class="license-field-value">
          ${escapeHtml(target.license || "Royalty-Free Commercial License")}
          ${target.license_url ? `• <a href="${escapeHtml(target.license_url)}" target="_blank" rel="noopener noreferrer">Read License Deed ↗</a>` : ""}
        </span>
      </div>

      <div class="license-field-row">
        <span class="license-field-label">Commercial &amp; Web App Permission</span>
        <span class="license-field-value" style="color: #2ed573;">
          ✓ Fully Permitted for Personal, Web, and Public App Distribution without royalty fees
        </span>
      </div>

      <div class="license-field-row">
        <span class="license-field-label">Attribution Statement (Click to Copy)</span>
        <div class="license-attr-box" id="licenseAttrBox" title="Click to copy attribution">
          ${escapeHtml(target.attribution_text || `${target.title} by ${target.artist}, Licensed under Creative Commons`)}
        </div>
      </div>
    `;

    const attrBox = document.getElementById("licenseAttrBox");
    if (attrBox) {
      attrBox.addEventListener("click", () => {
        navigator.clipboard.writeText(attrBox.textContent.trim()).then(() => {
          toast("✓ Attribution statement copied to clipboard!");
        }).catch(() => {});
      });
    }

    licenseInfoModal.hidden = false;
  }

  function closeLicenseModal() {
    if (licenseInfoModal) licenseInfoModal.hidden = true;
  }

  // ==========================================================================
  // 7. RECIPIENT AUDIO EXPERIENCE (Strict Autoplay Compliance)
  // ==========================================================================
  function initRecipientMusicExperience(musicConfig) {
    if (!musicConfig || !musicConfig.track_id) return;
    currentMusicConfig = musicConfig;

    if (recipientTrackTitle) recipientTrackTitle.textContent = musicConfig.title;
    if (recipientTrackArtist) recipientTrackArtist.textContent = musicConfig.artist;
    if (recipientVolSlider) recipientVolSlider.value = musicConfig.volume ?? 0.35;

    if (recipientMusicWidget) recipientMusicWidget.hidden = false;
    if (recipientMusicTapPrompt && recipientPromptText) {
      recipientPromptText.textContent = `Tap anywhere to hear our song: ${musicConfig.title}`;
      recipientMusicTapPrompt.hidden = false;
    }

    // Prepare audio instance
    const audioSrc = musicConfig.stream_url || `${API_BASE}/api/music/stream/${musicConfig.track_id}`;
    recipientAudioPlayer = new Audio();
    recipientAudioPlayer.src = audioSrc;
    recipientAudioPlayer.loop = musicConfig.loop !== false;
    recipientAudioPlayer.volume = 0; // Starts at 0 for fade in

    recipientAudioPlayer.onerror = () => {
      // Fallback directly to CDN url
      if (musicConfig.audio_url && recipientAudioPlayer.src !== musicConfig.audio_url) {
        recipientAudioPlayer.src = musicConfig.audio_url;
      }
    };

    // User gesture unlock listener
    const startAudioOnFirstGesture = () => {
      if (recipientAudioStarted) return;
      recipientAudioStarted = true;
      startRecipientPlayback();

      // Remove window listeners once triggered
      window.removeEventListener("click", startAudioOnFirstGesture);
      window.removeEventListener("touchstart", startAudioOnFirstGesture);
      window.removeEventListener("keydown", startAudioOnFirstGesture);
    };

    window.addEventListener("click", startAudioOnFirstGesture, { once: true });
    window.addEventListener("touchstart", startAudioOnFirstGesture, { once: true });
    window.addEventListener("keydown", startAudioOnFirstGesture, { once: true });

    // Floating prompt click directly starts playback
    if (recipientMusicTapPrompt) {
      recipientMusicTapPrompt.addEventListener("click", (e) => {
        e.stopPropagation();
        recipientAudioStarted = true;
        startRecipientPlayback();
      });
    }
  }

  function startRecipientPlayback() {
    if (!recipientAudioPlayer || !currentMusicConfig) return;

    if (currentMusicConfig.start_time && recipientAudioPlayer.currentTime < 1) {
      recipientAudioPlayer.currentTime = currentMusicConfig.start_time;
    }

    const targetVolume = typeof currentMusicConfig.volume === "number" ? currentMusicConfig.volume : 0.35;
    const fadeDuration = typeof currentMusicConfig.fade_in === "number" ? currentMusicConfig.fade_in : 3;

    recipientAudioPlayer.play().then(() => {
      isRecipientPlaying = true;
      updateRecipientMusicUI(true);
      fadeInAudio(recipientAudioPlayer, targetVolume, fadeDuration);
      if (recipientMusicTapPrompt) recipientMusicTapPrompt.hidden = true;
    }).catch((err) => {
      console.warn("Recipient playback waiting for explicit tap:", err);
      updateRecipientMusicUI(false);
    });
  }

  function toggleRecipientPlayback() {
    if (!recipientAudioPlayer) return;
    if (recipientAudioPlayer.paused) {
      recipientAudioPlayer.play().then(() => {
        isRecipientPlaying = true;
        updateRecipientMusicUI(true);
      }).catch((e) => console.warn(e));
    } else {
      recipientAudioPlayer.pause();
      isRecipientPlaying = false;
      updateRecipientMusicUI(false);
    }
  }

  function updateRecipientMusicUI(playing) {
    if (recipientPlayIcon) {
      recipientPlayIcon.textContent = playing ? "⏸" : "▶";
    }
    if (recipientMusicPlayBtn) {
      recipientMusicPlayBtn.classList.toggle("playing", playing);
    }
  }

  function fadeInAudio(audio, targetVolume, durationSec) {
    if (!audio) return;
    const steps = 30;
    const intervalTime = (Math.max(1, durationSec) * 1000) / steps;
    const stepIncrement = targetVolume / steps;
    let currentVol = 0;
    audio.volume = 0;

    const timer = setInterval(() => {
      currentVol = Math.min(targetVolume, currentVol + stepIncrement);
      try { audio.volume = currentVol; } catch (_) {}
      if (currentVol >= targetVolume) {
        clearInterval(timer);
      }
    }, intervalTime);
  }

  // ==========================================================================
  // 8. EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Customizer Modal Buttons
    if (openMusicPickerBtn) openMusicPickerBtn.addEventListener("click", openMusicPicker);
    if (changeMusicBtn) changeMusicBtn.addEventListener("click", openMusicPicker);
    if (removeMusicBtn) removeMusicBtn.addEventListener("click", removeMusicTrack);

    if (previewSelectedMusicBtn) {
      previewSelectedMusicBtn.addEventListener("click", () => {
        if (currentMusicConfig) toggleTrackPreview(currentMusicConfig);
      });
    }

    if (viewSelectedLicenseBtn) {
      viewSelectedLicenseBtn.addEventListener("click", () => {
        if (currentMusicConfig) openLicenseModal(currentMusicConfig);
      });
    }

    // Customization Drawer Controls
    if (musicVolumeInput) {
      musicVolumeInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        if (currentMusicConfig) currentMusicConfig.volume = val;
        if (musicVolumeVal) musicVolumeVal.textContent = `${Math.round(val * 100)}%`;
        if (previewAudioPlayer && previewingTrackId) {
          previewAudioPlayer.volume = val;
        }
      });
    }

    if (musicLoopCheckbox) {
      musicLoopCheckbox.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        if (currentMusicConfig) currentMusicConfig.loop = isChecked;
        if (musicLoopVal) musicLoopVal.textContent = isChecked ? "ON" : "OFF";
      });
    }

    if (musicStartTimeInput) {
      musicStartTimeInput.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10) || 0;
        if (currentMusicConfig) currentMusicConfig.start_time = val;
        if (musicStartTimeVal) musicStartTimeVal.textContent = `${val}s`;
      });
    }

    if (musicFadeInInput) {
      musicFadeInInput.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10) || 0;
        if (currentMusicConfig) currentMusicConfig.fade_in = val;
        if (musicFadeInVal) musicFadeInVal.textContent = `${val}s`;
      });
    }

    // Music Picker Modal
    if (closeMusicPickerBtn) closeMusicPickerBtn.addEventListener("click", closeMusicPicker);
    if (closePickerDoneBtn) closePickerDoneBtn.addEventListener("click", closeMusicPicker);
    if (musicPickerBackdrop) musicPickerBackdrop.addEventListener("click", closeMusicPicker);

    // Search Input
    if (musicSearchInput) {
      musicSearchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        activeSearchQuery = val;
        if (clearMusicSearchBtn) clearMusicSearchBtn.hidden = !val.trim();

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          fetchTracks(activeCategory, activeSearchQuery);
        }, 250);
      });
    }

    if (clearMusicSearchBtn) {
      clearMusicSearchBtn.addEventListener("click", () => {
        if (musicSearchInput) musicSearchInput.value = "";
        activeSearchQuery = "";
        clearMusicSearchBtn.hidden = true;
        fetchTracks(activeCategory, "");
      });
    }

    if (executeMusicSearchBtn) {
      executeMusicSearchBtn.addEventListener("click", () => {
        const query = musicSearchInput ? musicSearchInput.value : "";
        activeSearchQuery = query;
        fetchTracks(activeCategory, activeSearchQuery);
      });
    }

    // License Modal
    if (closeLicenseModalBtn) closeLicenseModalBtn.addEventListener("click", closeLicenseModal);
    if (dismissLicenseModalBtn) dismissLicenseModalBtn.addEventListener("click", closeLicenseModal);
    if (licenseModalBackdrop) licenseModalBackdrop.addEventListener("click", closeLicenseModal);

    // Recipient Player Controls
    if (recipientMusicPlayBtn) {
      recipientMusicPlayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleRecipientPlayback();
      });
    }

    if (recipientLicenseBtn) {
      recipientLicenseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLicenseModal(currentMusicConfig);
      });
    }

    if (recipientMuteBtn) {
      recipientMuteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!recipientAudioPlayer) return;
        if (isMuted) {
          isMuted = false;
          recipientAudioPlayer.volume = preMuteVolume;
          recipientMuteBtn.textContent = "🔊";
          if (recipientVolSlider) recipientVolSlider.value = preMuteVolume;
        } else {
          preMuteVolume = recipientAudioPlayer.volume || 0.35;
          isMuted = true;
          recipientAudioPlayer.volume = 0;
          recipientMuteBtn.textContent = "🔇";
          if (recipientVolSlider) recipientVolSlider.value = 0;
        }
      });
    }

    if (recipientVolSlider) {
      recipientVolSlider.addEventListener("input", (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        if (recipientAudioPlayer) {
          recipientAudioPlayer.volume = val;
          isMuted = val === 0;
          if (recipientMuteBtn) recipientMuteBtn.textContent = isMuted ? "🔇" : "🔊";
        }
      });
    }

    if (dismissMusicPromptBtn) {
      dismissMusicPromptBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (recipientMusicTapPrompt) recipientMusicTapPrompt.hidden = true;
      });
    }
  }

  // HTML Escape helper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialize
  setupEventListeners();

  // Expose hooks to window
  window.getCurrentMusicConfig = () => currentMusicConfig;
  window.setCurrentMusicConfig = (cfg) => {
    currentMusicConfig = cfg;
    syncMusicCustomizerUI();
  };
  window.syncMusicCustomizerUI = syncMusicCustomizerUI;
  window.initRecipientMusicExperience = initRecipientMusicExperience;
  window.openMusicPicker = openMusicPicker;
  window.openLicenseModal = openLicenseModal;

})();

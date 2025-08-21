class UpliftNarrator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // State
    this.audio = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    
    // Render initial UI
    this.render();
  }

  connectedCallback() {
    // Setup event listeners after DOM is ready
    this.setupEventListeners();
    // Load audio
    this.loadAudio();
  }

  disconnectedCallback() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }

  // Get attributes with defaults
  get apiUrl() {
    const baseUrl = this.getAttribute('base-url') || 'https://api.upliftai.org';
    const voiceId = this.getAttribute('voice-id') || 'v_meklc281';
    const articleUrl = this.getAttribute('url') || window.location.href;
    return `${baseUrl}/v1/article-narration?voiceId=${voiceId}&url=${encodeURIComponent(articleUrl)}`;
  }

  async loadAudio() {
    const container = this.shadowRoot.querySelector('.un-container');
    container.classList.add('un-loading');
    
    try {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      
      // Setup audio event listeners
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration;
        this.updateTimeDisplay();
        container.classList.remove('un-loading');
      });
      
      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime;
        this.updateProgress();
        this.updateTimeDisplay();
      });
      
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.updatePlayButton();
      });
      
      this.audio.addEventListener('error', () => {
        container.classList.remove('un-loading');
        container.classList.add('un-error');
      });
      
      // Load the audio
      this.audio.src = this.apiUrl;
      this.audio.load();
      
    } catch (error) {
      console.error('Failed to load audio:', error);
      container.classList.remove('un-loading');
      container.classList.add('un-error');
    }
  }

  togglePlay() {
    if (!this.audio) return;
    
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
  }

  seek(event) {
    if (!this.audio || !this.duration || this.duration <= 0) return;
    
    const progressBar = this.shadowRoot.querySelector('.un-progress-bar');
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    
    this.audio.currentTime = percent * this.duration;
  }

  updatePlayButton() {
    const playBtn = this.shadowRoot.querySelector('.un-play-btn');
    if (!playBtn) return;
    
    if (this.isPlaying) {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>
      `;
    } else {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
      `;
    }
  }

  updateProgress() {
    const progress = this.shadowRoot.querySelector('.un-progress-fill');
    if (!progress || !this.duration) return;
    
    const percent = (this.currentTime / this.duration) * 100;
    progress.style.width = `${percent}%`;
  }

  updateTimeDisplay() {
    const currentEl = this.shadowRoot.querySelector('.un-time-current');
    const durationEl = this.shadowRoot.querySelector('.un-time-duration');
    
    if (currentEl) currentEl.textContent = this.formatTime(this.currentTime);
    if (durationEl) durationEl.textContent = this.formatTime(this.duration);
  }

  formatTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  setupEventListeners() {
    const playBtn = this.shadowRoot.querySelector('.un-play-btn');
    const progressBar = this.shadowRoot.querySelector('.un-progress-bar');
    const speedSelect = this.shadowRoot.querySelector('.un-speed-select');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }
    
    if (progressBar) {
      progressBar.addEventListener('click', (e) => this.seek(e));
    }
    
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        if (this.audio) {
          this.audio.playbackRate = parseFloat(e.target.value);
        }
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
          direction: ltr !important;
        }

        .un-container {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 10px 12px;
          max-width: 400px;
          direction: ltr !important;
        }

        .un-container.un-loading .un-player {
          opacity: 0.5;
          pointer-events: none;
        }

        .un-container.un-loading .un-status-message {
          display: block;
        }

        .un-container.un-error .un-player {
          display: none;
        }

        .un-container.un-error .un-error-message {
          display: block;
        }

        .un-status-message,
        .un-error-message {
          display: none;
          text-align: center;
          padding: 8px;
          color: #666;
          font-size: 13px;
        }

        .un-error-message {
          color: #d00;
        }

        .un-player {
          display: flex;
          align-items: center;
          gap: 12px;
          direction: ltr !important;
        }

        .un-play-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f0f0f0;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .un-play-btn:hover {
          background: #e0e0e0;
        }

        .un-play-btn svg {
          width: 16px;
          height: 16px;
          color: #333;
        }

        .un-player-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .un-progress-bar {
          height: 4px;
          background: #e5e5e5;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          margin-bottom: 6px;
        }

        .un-progress-fill {
          height: 100%;
          background: #333;
          border-radius: 2px;
          width: 0;
          transition: width 0.1s;
        }

        .un-player-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #666;
        }

        .un-time {
          font-variant-numeric: tabular-nums;
        }

        .un-player-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .un-speed-select {
          background: transparent;
          border: none;
          color: #666;
          font-size: 11px;
          cursor: pointer;
          padding: 2px;
        }

        .un-branding {
          font-size: 9px;
          white-space: nowrap;
          padding-left: 4px;
          border-left: 1px solid #e5e5e5;
        }

        .un-branding a {
          color: #aaa;
          text-decoration: none;
        }

        .un-branding a:hover {
          color: #888;
          text-decoration: underline;
        }
      </style>

      <div class="un-container">
        <div class="un-status-message">Loading audio...</div>
        <div class="un-error-message">Failed to load audio. Please check your domain is registered.</div>
        
        <div class="un-player">
          <button class="un-play-btn" aria-label="Play">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
          </button>
          
          <div class="un-player-main">
            <div class="un-progress-bar">
              <div class="un-progress-fill"></div>
            </div>
            <div class="un-player-info">
              <div class="un-time">
                <span class="un-time-current">0:00</span>
                /
                <span class="un-time-duration">0:00</span>
              </div>
              <div class="un-player-right">
                <select class="un-speed-select">
                  <option value="0.75">0.75x</option>
                  <option value="1" selected>1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
                <div class="un-branding">
                  <a href="https://upliftai.org" target="_blank" rel="noopener">Powered by Uplift AI</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('uplift-narrator', UpliftNarrator);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UpliftNarrator;
}
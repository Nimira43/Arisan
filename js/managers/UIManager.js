import { EVENTS } from '../core/constants.js'

export class UIManager {
  constructor(events) {
    this.events = events
    this.timerEl = document.getElementById('timer')
    this.mainMenuEl = document.getElementById('mainMenu')
    this.pauseMenuEl = document.getElementById('pauseMenu')
    this.loadingScreenEl = document.getElementById('loadingScreen')
    this.playBtnEl = document.getElementById('playBtn')
    this.resumeBtnEl = document.getElementById('resumeBtn')
    this.quitBtnEl = document.getElementById('quitBtn')
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.playBtnEl?.addEventListener('click', () => this.events.emit(EVENTS.GAME_START))
    this.resumeBtnEl?.addEventListener('click', () => this.events.emit(EVENTS.GAME_RESUME))
    this.quitBtnEl?.addEventListener('click', () => this.events.emit(EVENTS.GAME_RETURN_TO_MENU));
        
   [this.playBtnEl, this.resumeBtnEl, this.quitBtnEl].forEach(btn => {
      btn?.addEventListener('mouseenter', () => this.events.emit(EVENTS.SOUND, 'button_hover'))
    })
  }

  hideAllPanels() {
    [this.mainMenuEl, this.pauseMenuEl, this.loadingScreenEl].forEach(p => p.classList.remove('active'))
  }

  showPanel(panelId) {
    this.hideAllPanels()
    this[`${panelId}El`]?.classList.add('active')
  }

  showTimer() {
    if (this.timerEl) this.timerEl.style.display = 'block'
  }
  
  hideTimer() {
    if (this.timerEl) this.timerEl.style.display = 'none'
  }

  updateTimer(time) {
    if (!this.timerEl) return
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    this.timerEl.textContent = `${mins}:${String(secs).padStart(2,'0')}`
  }

  
}
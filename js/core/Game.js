import { GAME_WIDTH, GAME_HEIGHT, ASPECT_RATIO, CANVAS_MARGIN } from './constants.js'
import { RenderSystem } from '../systems/RenderSystem.js'
import { Player } from '../entities/Player.js'
import { ImageManager } from '../managers/ImageManager.js'
import { AudioManager } from '../managers/AuditoManager.js'
import { UIManager } from '../managers/UIManager.js'

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas')

    this.imageManager = new ImageManager()
    this.audioManager = new AudioManager()
    this.uiManager = new UIManager(this)

    this.renderSystem = new RenderSystem(
      this.canvas,
      this.imageManager
    )

    this.player = new Player()
    this.keys = {}
    this.lastTime = 0;
    this.time = 0
    this.state = 'menu'
    this.init()
  }
  
  async init() {
    await Promise.all([
      this.imageManager.loadAll(),
      this.audioManager.loadAll()
    ])

    this.uiManager.showPanel('mainMenu')

    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas())
    this.setupInput()

    this.lastTime = performance.now()
    requestAnimationFrame((t) => this.gameLoop(t))
  }
  
  gameLoop(timestamp) { 
    if (this.lastTime === 0) {
      this.lastTime = timestamp
    }
    
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1)
    this.lastTime = timestamp

    if (this.state === 'playing') {
      this.time += dt
      this.uiManager.updateTimer(this.time)
    }

    this.update(dt)
    this.renderSystem.render(this.state, this.player)
    requestAnimationFrame((t) => this.gameLoop(t))
  }

  update(dt) {
    if (this.state !== 'playing') return

    this.player.update(dt, this.keys)
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true
    
      if (e.key === 'Escape') {
        if (this.state === 'playing') {
          this.pause()
        } else if (this.state === 'paused') {
          this.resume()
        }
      }    
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false
    })

    window.addEventListener('contextmenu', () => {
      this.keys = {}
    })
    window.addEventListener('blur', () => {
      this.keys = {}
    })
  }

  startGame() {
    this.audioManager.play('button_click')
    this.state = 'playing'
    this.uiManager.hideAllPanels()
    this.time = 0
    this.uiManager.showTimer()
  
    this.player.reset()

    this.lastTime = performance.now()
  }

  pause() {
    this.audioManager.play('pause')
    this.state = 'paused'
    this.uiManager.showPanel('pauseMenu')
  }
  
  resume() {
    this.audioManager.play('unpause')
    this.state = 'playing'
    this.uiManager.hideAllPanels()
  }
  
  returnToMenu() {
    this.audioManager.play('button_click')
    this.state = 'menu'
    this.uiManager.hideAllPanels()
    this.uiManager.hideTimer()
    this.uiManager.showPanel('mainMenu')
  }

  resizeCanvas() {
    let w
    let h

    const availableWidth = window.innerWidth - CANVAS_MARGIN * 2
    const availableHeight = window.innerHeight -CANVAS_MARGIN * 2

    if (availableWidth / availableHeight > ASPECT_RATIO) {
      h = availableHeight
      w = h * ASPECT_RATIO
    } else {
      w = availableWidth
      h = w / ASPECT_RATIO
    }

    this.canvas.width = GAME_WIDTH
    this.canvas.height = GAME_HEIGHT

    this.canvas.style.width = w + 'px'
    this.canvas.style.height = h + 'px'
    this.canvas.style.margin = `${CANVAS_MARGIN}px`
  }
}
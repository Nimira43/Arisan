import { GAME_WIDTH, GAME_HEIGHT, ASPECT_RATIO, CANVAS_MARGIN, GAME_STATES, EVENTS } from './constants.js'
import { EventEmitter } from './EventEmitter.js'
import { RenderSystem } from '../systems/RenderSystem.js'
import { Player } from '../entities/Player.js'
import { ImageManager } from '../managers/ImageManager.js'
import { AudioManager } from '../managers/AudioManager.js'
import { UIManager } from '../managers/UIManager.js'
import { EnemyManager } from '../managers/EnemyManager.js'
import { EnemySpawner } from '../managers/EnemySpawner.js'
import { CollisionSystem } from '../systems/ColisionSystem.js'
import { CollisionManager } from '../managers/CollisionManager.js'
import { missionData } from '../data/playerData.js'

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas')
    this.events = new EventEmitter()

    this.imageManager = new ImageManager()
    this.audioManager = new AudioManager()
    this.uiManager = new UIManager(this.events)
    this.enemyManager = new EnemyManager()
    this.enemySpawner = new EnemySpawner(this.enemyManager)
    this.renderSystem = new RenderSystem(this.canvas, this.imageManager)
    this.collisionSystem = new CollisionSystem()
    this.collisionManager = new CollisionManager(this.collisionSystem, this.events)
    this.player = new Player()
    this.keys = {}
    this.lastTime = 0;
    this.time = 0
    this.state = GAME_STATES.MENU
    this.enemiesKilled = 0
    this.init()
  }
  
  async init() {
    await Promise.all([
      this.imageManager.loadAll(),
      this.audioManager.loadAll()
    ])

    this.events.on(EVENTS.SOUND, (name) => this.audioManager.play(name))
    this.events.on(EVENTS.GAME_START, () => this.startGame())
    this.events.on(EVENTS.GAME_PAUSE, () => this.pause())
    this.events.on(EVENTS.GAME_RESUME, () => this.resume())
    this.events.on(EVENTS.GAME_RETURN_TO_MENU, () => this.returnToMenu())
    this.events.on(EVENTS.MISSION_COMPLETE, () => this.missionComplete())
    
    this.events.on(EVENTS.PLAYER_DAMAGED, (health, maxHealth) => {
      this.events.emit(EVENTS.SOUND, 'player_hurt')
      this.uiManager.updateHealthBar(health, maxHealth)
    })
    
    this.events.on(EVENTS.PLAYER_DIED, () => {
      this.events.emit(EVENTS.SOUND, 'game_over')
      this.gameOver()
    })
    
    this.events.on(EVENTS.ENEMY_DIED, () => {
      this.enemiesKilled++
      this.events.emit(EVENTS.ENEMY_KILLED_COUNT, this.enemiesKilled)
      this.checkMissionConditions()
    })

    this.uiManager.showPanel('mainMenu')

    this.resizeCanvas()
    window.addEventListener('resize', () => this.resizeCanvas())
    this.setupInput()

    this.lastTime = performance.now()
    requestAnimationFrame((t) => this.gameLoop(t))
  }
  
  gameLoop(timestamp) { 
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1)
    this.lastTime = timestamp

    if (this.state === GAME_STATES.PLAYING) {
      this.time += dt
      this.uiManager.updateTimer(this.time)
      this.checkMissionConditions()
    }

    const activeEnemies = this.enemyManager.getActiveEnemies()
    this.update(dt, activeEnemies)
    this.renderSystem.render(this.state, this.player, activeEnemies)
    requestAnimationFrame((t) => this.gameLoop(t))
  }

  update(dt, activeEnemies) {
    if (this.state !== GAME_STATES.PLAYING) return

    this.player.update(dt, this.keys)
    this.enemyManager.update(dt, this.player)
    this.enemySpawner.update(dt)
    this.collisionManager.update(this.player, activeEnemies)
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true
    
      if (e.key === 'Escape') {
        if (this.state === GAME_STATES.PLAYING) {
          this.pause()
        } else if (this.state === GAME_STATES.PAUSED) {
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
    this.events.emit(EVENTS.SOUND, 'button_click')
    this.state = GAME_STATES.PLAYING
    this.uiManager.hideAllPanels()
    this.time = 0
    this.enemiesKilled = 0
    this.uiManager.showHUD()
    this.player.reset()
    this.enemyManager.reset()
    this.enemySpawner.reset()
    this.uiManager.updateHealthBar(this.player.health, this.player.maxHealth)
    this.lastTime = performance.now()
  }

  pause() {
    this.events.emit(EVENTS.SOUND, 'pause')
    this.state = GAME_STATES.PAUSED
    this.uiManager.showPanel('pauseMenu')
  }
  
  resume() {
    this.events.emit(EVENTS.SOUND, 'unpause')
    this.state = GAME_STATES.PLAYING
    this.uiManager.hideAllPanels()
  }
  
  returnToMenu() {
    this.events.emit(EVENTS.SOUND, 'button_click')
    this.state = GAME_STATES.MENU
    this.uiManager.hideAllPanels()
    this.uiManager.hideHUD()
    this.uiManager.showPanel('mainMenu')
  }

  gameOver() {
    this.state = GAME_STATES.GAME_OVER
    this.uiManager.hideHUD()
    this.uiManager.showPanel('gameOverMenu')
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

  checkMissionConditions() {
    if (this.state !== GAME_STATES.PLAYING) return
    if (this.enemiesKilled >= missionData.killCount || this.time >= missionData.surviveTime) {
      this.events.emit(EVENTS.MISSION_COMPLETE)
    }
  }

  missionComplete() {
    this.state = GAME_STATES.MISSION_COMPLETE
    this.uiManager.hideHUD()
    this.uiManager.showPanel('missionCompleteMenu')
    this.events.emit(EVENTS.SOUND, 'mission_complete')
  }
}
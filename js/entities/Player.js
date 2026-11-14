import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js'
import { playerData } from '../data/playerData.js'

export class Player {
  constructor() {
    this.width = playerData.width
    this.height = playerData.height
    this.x = (GAME_WIDTH - this.width) / 2
    this.y = (GAME_HEIGHT - this.height) / 2
    this.collisionRadius = playerData.collisionRadius
    this.invincibilityDuration = playerData.invincibilityDuration
    this.invincible = false
    this.invincibilityTimer = 0
    this.speed = playerData.speed
    this.maxHealth = playerData.maxHealth
    this.health = this.maxHealth
    this.speedMultiplier = 1
  }

  reset() {
    this.x = (GAME_WIDTH - this.width) / 2
    this.y = (GAME_HEIGHT - this.height) / 2
    this.speed = playerData.speed
    this.speedMultiplier = 1
    this.health = this.maxHealth
    this.invincible = false
    this.invincibilityTimer = 0
  }

  update(dt, keys) {
    if (this.invincible) {
      this.invincibilityTimer -= dt

      if (this.invincibilityTimer <= 0) {
        this.invincible = false
        this.invincibilityTimer = 0
      }
    }

    let dx = 0
    let dy = 0

    if (keys['w'] || keys['arrowup']) dy -= 1
    if (keys['s'] || keys['arrowdown']) dy += 1
    if (keys['a'] || keys['arrowleft']) dx -= 1
    if (keys['d'] || keys['arrowright']) dx += 1
    
    if (dx || dy) {
      const len = Math.sqrt(dx * dx + dy * dy)
      dx /= len
      dy /= len

      this.x += dx * this.speed * this.speedMultiplier * dt
      this.y += dy * this.speed * this.speedMultiplier * dt
    }

    this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x))
    this.y = Math.max(0, Math.min(GAME_HEIGHT - this.height, this.y))
  }

  takeDamage(amount) {
    if (this.invincible) return false

    this.health = Math.max(0, this.health - amount)
    this.invincible = true
    this.invincibilityTimer = this.invincibilityDuration
    return true
  }

  isDead() {
    return this.health <= 0
  }
}
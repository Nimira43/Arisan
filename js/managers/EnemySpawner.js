import { GAME_WIDTH, GAME_HEIGHT, ENEMY_SPAWN_INTERVAL, ENEMY_SPAWN_MARGIN } from '../core/constants.js'
import { enemyData } from '../data/enemyData.js'

export class EnemySpawner {
  constructor(enemyManager) {
    this.enemyManager = enemyManager
    this.spawnTimer = 0
    this.spawnInterval = ENEMY_SPAWN_INTERVAL
    this.enemyTypes = []

    for (const type in enemyData) {
      this.enemyTypes.push(type)
    }
  }

  update(dt) {
    this.spawnTimer += dt

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnWave()
      this.spawnTimer -= this.spawnInterval
    }
  }

  spawnWave() {
    const type = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]
    const edge = Math.floor(Math.random() * 4)
    let x
    let y

    switch (edge) {
      case 0:
        x = Math.random() * GAME_WIDTH
        y = -ENEMY_SPAWN_MARGIN
        break
      case 1:
        x = GAME_WIDTH + ENEMY_SPAWN_MARGIN
        y = Math.random() * GAME_HEIGHT
        break
      case 2:
        x = Math.random() * GAME_WIDTH
        y = GAME_HEIGHT + ENEMY_SPAWN_MARGIN
        break
      case 3:
        x = -ENEMY_SPAWN_MARGIN
        y = Math.random() * GAME_HEIGHT
        break
      default:
        x = -ENEMY_SPAWN_MARGIN
        y = Math.random() * GAME_HEIGHT
    }
    this.enemyManager.spawn(type, x, y)
  }

  reset() {
    this.spawnTimer = 0
  }
}
import { EVENTS } from '../core/constants.js'

export class CollisionManager {
  constructor(collisionSystem, events) {
    this.collisionSystem = collisionSystem
    this.events = events
  }

  update(player, enemies) {
    this.checkPlayerVsEnemies(player, enemies)
  }

  checkPlayerVsEnemies(player, enemies) {
    for (const enemy of enemies) {
      if (!enemy.active) continue
      if (this.collisionSystem.checkCircleCircle(player, enemy)) {
        enemy.active = false
        const damageApplied = player.takeDamage(enemy.damage)

        if (damageApplied) {
          this.events.emit(EVENTS.PLAYER_DAMAGED, player.health, player.maxHealth)

          if (player.isDead()) {
            this.events.emit(EVENTS.PLAYER_DIED)
            return
          }
        }
        this.events.emit(EVENTS.ENEMY_DIED, enemy)
      }
    }
  }
}
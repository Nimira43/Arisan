export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720
export const GRID_SIZE = 40
export const ASPECT_RATIO = 16 / 9
export const CANVAS_MARGIN = 15

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused'
}

export const ENEMY_DESPAWN_MARGIN = 200
export const ENEMY_SPAWN_MARGIN = 100
export const ENEMY_SPAWN_INTERVAL = 2

export const EVENTS = {
  SOUND: 'sound',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RETURN_TO_MENU: 'game:returnToMenu'
}
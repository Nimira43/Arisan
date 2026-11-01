export class ImageManager {
  constructor() {
    this.images = {}
  }

  load(name, path) {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = path
      
      this.images[name] = { img, loaded:false }
      
      img.onload = () => {
        this.images[name].loaded = true
        console.log(`[DEV] Image loaded: ${name}`)
        resolve()
      }
      
      img.onerror = () => {
        console.log(`Image fail: ${name} - using fallback.`)
        resolve()
      }
    })
  }

  get(name) {
    return this.images[name]?.loaded 
      ? this.images[name].img
      : null
  }

  async loadAll() {
    await Promise.all([
      this.load('player', './images/player.png'),
      this.load('enemy_drifter', './images/enemy_drifter.png'),
      this.load('enemy_seeker', './images/enemy_seeker.png')
    ])
    const DEBUG_LOAD_DELAY = 1000
    await new Promise(resolve => setTimeout(resolve, DEBUG_LOAD_DELAY))
  }
}
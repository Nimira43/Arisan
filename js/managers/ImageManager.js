import { playerData } from '../data/playerData.js'
import { enemyData } from '../data/enemyData.js'

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
    const imageEntries = [
      ...Object.values(enemyData).map(e => (
        {
          name: e.image,
          path: `./images/${e.image}.png`
        })),
        {
          name: playerData.image,
          path: `./images/${playerData.image}.png`
        }
    ]
    await Promise.all(
      imageEntries.map(({ name, path }) => this.load(name, path)
    ))
    const DEBUG_LOAD_DELAY = 1000
    await new Promise(resolve => setTimeout(resolve, DEBUG_LOAD_DELAY))
  }
}
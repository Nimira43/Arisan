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
      this.load('player', './images/player.png')
    ])
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
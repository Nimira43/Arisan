import { DriftBehaviour } from './DriftBehaviour.js'
import { SeekBehaviour } from './SeekBehaviour.js'

export class BehaviourFactory {
  static create(behaviourType) {
    switch (behaviourType) {
      case 'seek':
        return new SeekBehaviour()
      case 'drift':
        return new DriftBehaviour()
      default:
        console.log(`Unknown behaviour type: ${behaviourType}`)
        return new SeekBehaviour()
    }
  }
}
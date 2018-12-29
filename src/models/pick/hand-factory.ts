import Paper from './hand/paper'
import Scissor from './hand/scissor'
import Rock from './hand/rock'
import Hand from './hand/hand'
import { injectable } from 'inversify'

@injectable()
class HandFactory {
  private HANDS: Map<string, Hand>
  constructor() {
    this.HANDS = new Map([
      ['PAPER', new Paper()],
      ['SCISSOR', new Scissor()],
      ['ROCK', new Rock()]
    ])
  }

  public createHand(strHand: string): Hand {
    const hand = this.HANDS.get(strHand.toUpperCase())
    if (hand) {
      return hand
    }

    throw new ApplicationError('手が見つかりませんでした')
  }
}

export default HandFactory

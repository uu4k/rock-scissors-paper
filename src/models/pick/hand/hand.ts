import Paper from './paper'
import Rock from './rock'
import Scissor from './scissor'

abstract class Hand {
  abstract get value(): string
  abstract get key(): string

  public static createHand(strHand: string): Hand {
    Hand.HANDS.forEach(hand => {
      if (strHand === hand.key) {
        return hand
      }
    })

    throw new ApplicationError('手が見つかりませんでした')
  }

  private static readonly HANDS = [new Scissor(), new Paper(), new Rock()]
}

export default Hand

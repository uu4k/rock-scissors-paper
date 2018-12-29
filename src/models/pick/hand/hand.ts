import Paper from './paper'
import Rock from './rock'
import Scissor from './scissor'

abstract class Hand {
  abstract get key(): string
  abstract get value(): string
}

export default Hand

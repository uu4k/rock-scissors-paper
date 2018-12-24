import Hand from './hand'

class Scissor extends Hand {
  public get key(): string {
    return 'scissor'
  }
  public get value(): string {
    return 'チョキ'
  }
}

export default Scissor

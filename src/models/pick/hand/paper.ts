import Hand from './hand'

class Paper extends Hand {
  public get key(): string {
    return 'paper'
  }
  public get value(): string {
    return 'パー'
  }
}

export default Paper

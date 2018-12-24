import Hand from './hand'

class Rock extends Hand {
  public get key(): string {
    return 'rock'
  }
  public get value(): string {
    return 'グー'
  }
}

export default Rock

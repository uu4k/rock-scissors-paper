import Id from './id'

class Battle {
  constructor(private _id: Id, private _opened: boolean = false) {}

  public get id(): string {
    return this._id.id
  }

  public get opened(): boolean {
    return this._opened
  }
}

export default Battle

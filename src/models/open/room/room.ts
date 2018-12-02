import Id from './id'

class Room {
  constructor(private _id: Id) {}

  public get id(): string {
    return this._id.id
  }
}

export default Room

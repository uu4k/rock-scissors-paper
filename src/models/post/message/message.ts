import Id from './id'
import Body from './body'

class Message {
  constructor(
    private _id?: Id,
    private _body?: Body,
    private _createdAt?: Date,
    private _updatedAt?: Date
  ) {}

  public get id(): string {
    return this._id ? this._id.id : ''
  }

  public get body(): string {
    return this._body ? this._body.body : ''
  }
}

export default Message

import Id from './id'
import Uid from '@/models/entry/user/uid'
import 'moment/locale/ja'

class Message {
  constructor(
    private _id?: Id,
    private _body?: string,
    private _uid?: Uid,
    private _author?: string,
    private _createdAt?: Date
  ) {}

  public get id(): string {
    return this._id ? this._id.id : ''
  }

  public get uid(): string {
    return this._uid ? this._uid.uid : ''
  }

  public get author(): string {
    return this._author ? this._author : ''
  }

  public get body(): string {
    return this._body ? this._body : ''
  }

  public get createdAt(): Date {
    return this._createdAt || new Date()
  }
}

export default Message

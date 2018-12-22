import Id from './id'
import Uid from '@/models/entry/user/uid'
import moment from 'moment'
import 'moment/locale/ja'

class Message {
  constructor(
    private _id?: Id,
    private _body?: string,
    private _uid?: Uid,
    private _author?: string,
    private _createdAt?: Date,
    private _updatedAt?: Date
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

  public get createdAt(): string {
    return this._createdAt ? moment(this._createdAt).fromNow() : ''
  }
}

export default Message

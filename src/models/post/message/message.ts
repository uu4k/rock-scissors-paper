import Id from './id'
import Body from './body'
import Uid from '@/models/entry/user/uid'
import Name from '@/models/entry/user/name'
import moment from 'moment'
import 'moment/locale/ja'

class Message {
  constructor(
    private _id?: Id,
    private _body?: Body,
    private _uid?: Uid,
    private _author?: Name,
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
    return this._author ? this._author.name : ''
  }

  public get body(): string {
    return this._body ? this._body.body : ''
  }

  public get createdAt(): string {
    return this._createdAt ? moment(this._createdAt).fromNow() : ''
  }
}

export default Message

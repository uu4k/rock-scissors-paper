import Id from './id'
import Uid from '@/models/entry/user/uid'
import 'moment/locale/ja'
import Icon from '@/models/entry/user/icon'
import ApplicationError from '@/error/application-error'

class Message {
  constructor(
    private _id?: Id,
    private _body?: string,
    private _uid?: Uid,
    private _author?: string,
    private _icon?: Icon,
    private _createdAt?: Date
  ) {
    if (!_body) {
      throw new ApplicationError('メッセージが空です')
    }
  }

  public get id(): string {
    return this._id ? this._id.id : ''
  }

  public get uid(): string {
    return this._uid ? this._uid.uid : ''
  }

  public get author(): string {
    return this._author ? this._author : ''
  }

  public get icon_img(): string {
    return this._icon ? this._icon.icon_img : ''
  }

  public get body(): string {
    return this._body ? this._body : ''
  }

  public get createdAt(): Date {
    return this._createdAt || new Date()
  }
}

export default Message

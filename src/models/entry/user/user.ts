import Uid from './uid'
import Icon from './icon'

class User {
  constructor(
    private _uid: Uid,
    private _name?: string,
    private _icon?: Icon
  ) {}

  public get uid(): string {
    return this._uid.uid
  }

  public get icon(): string {
    return this._icon ? this._icon.icon : ''
  }

  public get icon_img(): string {
    return this._icon ? this._icon.icon_img : ''
  }

  public get name(): string {
    return this._name ? this._name : ''
  }
}

export default User

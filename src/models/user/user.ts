import Uid from './uid'
import Name from './name'

class User {
  constructor(private _uid: Uid, private _name?: Name) {}

  public get uid(): string {
    return this._uid.uid
  }

  public get name(): string {
    return this._name ? this._name.name : ''
  }
}

export default User

import Uid from './uid'

class User {
  constructor(private _uid: Uid, private _name?: string) {}

  public get uid(): string {
    return this._uid.uid
  }

  public get name(): string {
    return this._name ? this._name : ''
  }
}

export default User

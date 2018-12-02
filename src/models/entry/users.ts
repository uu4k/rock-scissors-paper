import User from './user/user'

class Users {
  constructor(private _users: User[] = []) {}

  public asList(): never[] & User[] {
    // 不変にしたものを返す
    const users = Object.assign([], this._users)
    Object.freeze(users)
    return users
  }
}

export default Users

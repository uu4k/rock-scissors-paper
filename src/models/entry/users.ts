import User from './user/user'

class Users {
  constructor(private _users: User[] = []) {}

  public asList(): never[] & User[] {
    // 不変にしたものを返す
    const users = Object.assign([], this._users)
    Object.freeze(users)
    return users
  }

  public add(user: User): Users {
    // 不変とするために追加したオブジェクトを別途作成して返す
    const newusers = Object.assign([], this._users)
    newusers.push(user)
    return new Users(newusers)
  }
}

export default Users

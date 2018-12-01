import Id from './id'
import Users from './users'
import User from './user/user'

class Room {
  constructor(private _id: Id, private _users: Users = new Users()) {}

  public get users(): never[] & User[] {
    return this._users.asList()
  }

  // TODO ユーザー追加
}

export default Room

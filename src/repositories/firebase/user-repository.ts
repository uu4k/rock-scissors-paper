import UserRepositoryInterface from '../user-repository-interface'
import User from '@/models/user/user'
import Uid from '@/models/user/uid'
import Name from '@/models/user/name'

class UserRepository implements UserRepositoryInterface {
  constructor() {}

  login() {
    // TODO firebaseの匿名ログイン
    return new User(new Uid(''), new Name(''))
  }

  logout() {}

  loggedin() {
    return true
  }
}

export default UserRepository

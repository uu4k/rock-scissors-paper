import User from '@/models/user/user'
import Name from '@/models/user/name'
import Uid from '@/models/user/uid'

interface UserRepositoryInterface {
  login(): Promise<User>
  logout(): Promise<void>
  getUser(uid: Uid): Promise<User>
  saveUser(user: User): Promise<User>
}

export default UserRepositoryInterface

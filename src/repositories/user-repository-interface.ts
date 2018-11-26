import User from '@/models/user/user'

interface UserRepositoryInterface {
  login(): Promise<User>
  logout(): Promise<void>
  loggedin(): boolean
}

export default UserRepositoryInterface

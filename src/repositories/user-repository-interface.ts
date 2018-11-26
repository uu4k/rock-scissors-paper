import User from '@/models/user/user'

interface UserRepositoryInterface {
  login(): User
  logout(): void
  loggedin(): Boolean
}

export default UserRepositoryInterface

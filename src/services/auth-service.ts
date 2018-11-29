import UserRepositoryInterface from '@/repositories/user-repository-interface'
import User from '@/models/user/user'

class AuthService {
  constructor(private userRepository: UserRepositoryInterface) {}

  public login() {
    return this.userRepository.login()
  }

  public logout() {
    this.userRepository.logout()
  }

  public loggedin() {
    return this.userRepository.loggedin()
  }

  public async getLoggedinUserOrLoginUser() {
    if (!this.loggedin()) {
      await this.userRepository.login()
    }
    console.log('getLoggedinUser')
    return this.userRepository.getUser()
  }
}

export default AuthService

import UserRepositoryInterface from '@/repositories/user-repository-interface'

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
}

export default AuthService

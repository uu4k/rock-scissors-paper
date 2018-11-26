import UserRepositoryInterface from '@/repositories/user-repository-interface'

class AuthService {
  constructor(private userRepository: UserRepositoryInterface) {}

  login() {
    return this.userRepository.login()
  }

  logout() {
    this.userRepository.logout()
  }

  loggedin() {
    return this.userRepository.loggedin()
  }
}

export default AuthService

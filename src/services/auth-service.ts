import UserRepositoryInterface from '@/repositories/user-repository-interface'
import User from '@/models/user/user'
import Uid from '@/models/user/uid'
import Name from '@/models/user/name'

class AuthService {
  constructor(private userRepository: UserRepositoryInterface) {}

  public login(): Promise<User> {
    return this.userRepository.login()
  }

  public logout(): void {
    this.userRepository.logout()
  }

  public updateUserName(uid: string, newName: string): Promise<User> {
    // const originUser = this.userRepository.getUser(new Uid(uid))
    const newUser = new User(new Uid(uid), new Name(newName))

    return this.userRepository.saveUser(newUser)
  }

  public getUser(uid: string): Promise<User> {
    return this.userRepository.getUser(new Uid(uid))
  }
}

export default AuthService

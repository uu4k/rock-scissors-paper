import UserRepositoryInterface from '@/repositories/user-repository-interface'
import User from '@/models/room/user/user'
import Uid from '@/models/room/user/uid'
import Name from '@/models/room/user/name'
import RoomId from '@/models/room/id'

class AuthService {
  constructor(private userRepository: UserRepositoryInterface) {}

  public login(roomid: string): Promise<User> {
    return this.userRepository.login(new RoomId(roomid))
  }

  public logout(): void {
    this.userRepository.logout()
  }

  public updateUserName(
    roomid: string,
    uid: string,
    newName: string
  ): Promise<User> {
    // const originUser = this.userRepository.getUser(new Uid(uid))
    // TODO factory化
    const newUser = new User(new Uid(uid), new Name(newName))

    return this.userRepository.saveUser(new RoomId(roomid), newUser)
  }

  public getUser(roomid: string, uid: string): Promise<User> {
    return this.userRepository.getUser(new RoomId(roomid), new Uid(uid))
  }
}

export default AuthService

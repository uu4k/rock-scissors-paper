import UserRepositoryInterface from '@/repositories/user-repository-interface'
import User from '@/models/entry/user/user'
import Uid from '@/models/entry/user/uid'
import Name from '@/models/entry/user/name'
import RoomId from '@/models/open/room/id'
import RoomRepositoryInterface from '@/repositories/room-repository-interface'
import { inject, injectable } from 'inversify'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'

@injectable()
class EntryService {
  constructor(
    @inject(REPOSITORY_IDENTIFIER.ROOM)
    private roomRepository: RoomRepositoryInterface,
    @inject(REPOSITORY_IDENTIFIER.USER)
    private userRepository: UserRepositoryInterface
  ) {}

  public login(roomid: string): Promise<User> {
    if (!this.roomRepository.exists(new RoomId(roomid))) {
      throw new ApplicationError('対象のルームが存在しません')
    }
    return this.userRepository.login(new RoomId(roomid))
  }

  public logout(): void {
    this.userRepository.logout()
  }

  public setUserName(
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

export default EntryService

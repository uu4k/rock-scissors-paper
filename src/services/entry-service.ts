import UserRepositoryInterface from '@/repositories/user-repository-interface'
import User from '@/models/entry/user/user'
import Uid from '@/models/entry/user/uid'
import RoomId from '@/models/open/room/id'
import RoomRepositoryInterface from '@/repositories/room-repository-interface'
import { inject, injectable } from 'inversify'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'
import ApplicationError from '@/error/application-error'
import Icon from '@/models/entry/user/icon'

@injectable()
class EntryService {
  constructor(
    @inject(REPOSITORY_IDENTIFIER.ROOM)
    private roomRepository: RoomRepositoryInterface,
    @inject(REPOSITORY_IDENTIFIER.USER)
    private userRepository: UserRepositoryInterface
  ) {}

  public login(roomid: string): Promise<void> {
    if (!this.roomRepository.exists(new RoomId(roomid))) {
      throw new ApplicationError('対象のルームが存在しません')
    }
    return this.userRepository.login(new RoomId(roomid))
  }

  public logout(): void {
    this.userRepository.logout()
  }

  public setUserNameAndIcon(
    roomid: string,
    uid: string,
    newName: string,
    newIcon: string
  ): Promise<User> {
    const newUser = new User(new Uid(uid), newName, new Icon(newIcon))

    return this.userRepository.saveUser(new RoomId(roomid), newUser)
  }

  public getUser(roomid: string, uid: string): Promise<User> {
    return this.userRepository.getUser(new RoomId(roomid), new Uid(uid))
  }

  public setAuthSynchronizer(roomid: string, action: (user?: User) => void) {
    this.userRepository.onAuthChanged(new RoomId(roomid), action)
  }
}

export default EntryService

import User from '@/models/entry/user/user'
import Uid from '@/models/entry/user/uid'
import RoomId from '@/models/open/room/id'

interface UserRepositoryInterface {
  login(roomid: RoomId): Promise<User>
  logout(): Promise<void>
  getUser(roomid: RoomId, uid: Uid): Promise<User>
  saveUser(roomid: RoomId, user: User): Promise<User>
}

export default UserRepositoryInterface

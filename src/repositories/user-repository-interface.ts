import User from '@/models/room/user/user'
import Name from '@/models/room/user/name'
import Uid from '@/models/room/user/uid'
import RoomId from '@/models/room/id'

interface UserRepositoryInterface {
  login(roomid: RoomId): Promise<User>
  logout(): Promise<void>
  getUser(roomid: RoomId, uid: Uid): Promise<User>
  saveUser(roomid: RoomId, user: User): Promise<User>
}

export default UserRepositoryInterface

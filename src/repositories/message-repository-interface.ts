import RoomId from '@/models/open/room/id'
import Message from '@/models/post/message/message'
import Messages from '@/models/post/messages'
import User from '@/models/entry/user/user'

interface MessageRepositoryInterface {
  post(roomid: RoomId, user: User, message: Message): Promise<Message>
  getMessages(roomid: RoomId): Promise<Messages>
}

export default MessageRepositoryInterface

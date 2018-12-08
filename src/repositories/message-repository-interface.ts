import RoomId from '@/models/open/room/id'
import Message from '@/models/post/message/message'
import Messages from '@/models/post/messages'
import User from '@/models/entry/user/user'
import Change from '@/models/post/changes/change'

interface MessageRepositoryInterface {
  post(roomid: RoomId, user: User, message: Message): Promise<Message>
  getMessages(roomid: RoomId): Promise<Messages>
  onMessagesChanged(roomid: RoomId, sync: (change: Change) => void): void
}

export default MessageRepositoryInterface

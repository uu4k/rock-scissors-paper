import Message from '@/models/post/message/message'
import User from '@/models/entry/user/user'
import MessageRepositoryInterface from '@/repositories/message-repository-interface'
import RoomId from '@/models/open/room/id'
import Body from '@/models/post/message/body'
import Messages from '@/models/post/messages'

class PostService {
  constructor(private messageRepository: MessageRepositoryInterface) {}

  public post(roomid: string, user: User, body: string): Promise<Message> {
    return this.messageRepository.post(
      new RoomId(roomid),
      user,
      new Message(undefined, new Body(body))
    )
  }

  public getMessages(roomid: string): Promise<Messages> {
    return this.messageRepository.getMessages(new RoomId(roomid))
  }
}

export default PostService

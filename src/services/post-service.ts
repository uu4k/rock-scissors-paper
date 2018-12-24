import Message from '@/models/post/message/message'
import User from '@/models/entry/user/user'
import MessageRepositoryInterface from '@/repositories/message-repository-interface'
import RoomId from '@/models/open/room/id'
import Messages from '@/models/post/messages'
import { inject, injectable } from 'inversify'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'
import Change from '@/models/post/changes/change'
import TYPE_IDENTIFIER from '@/models/post/changes/type-identifier'

@injectable()
class PostService {
  constructor(
    @inject(REPOSITORY_IDENTIFIER.MESSAGE)
    private messageRepository: MessageRepositoryInterface
  ) {}

  public post(roomid: string, user: User, body: string): Promise<Message> {
    return this.messageRepository.post(
      new RoomId(roomid),
      user,
      new Message(undefined, body)
    )
  }

  public getMessages(roomid: string): Promise<Messages> {
    return this.messageRepository.getMessages(new RoomId(roomid))
  }

  public setMessageSynchronizer(
    roomid: string,
    sync: (change: Change) => void
  ): void {
    this.messageRepository.onMessagesChanged(new RoomId(roomid), sync)
  }

  public changeMessages(messages: Messages, change: Change) {
    // TODO OCP違反
    switch (change.type) {
      case TYPE_IDENTIFIER.ADDED:
        return messages.add(change.message)
      case TYPE_IDENTIFIER.MODIFIED:
        return messages.modify(change.message)
      case TYPE_IDENTIFIER.REMOVED:
        return messages.remove(change.message)
      default:
        return messages
    }
  }
}

export default PostService

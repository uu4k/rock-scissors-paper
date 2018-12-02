import MessageRepositoryInterface from '../message-repository-interface'
import RoomId from '@/models/open/room/id'
import Message from '@/models/post/message/message'
import Messages from '@/models/post/messages'
import firebase from 'firebase/app'
import User from '@/models/entry/user/user'
import Id from '@/models/post/message/id'
import Body from '@/models/post/message/body'

class MessageRepository implements MessageRepositoryInterface {
  constructor(private db: firebase.firestore.Firestore) {}

  public post(roomid: RoomId, user: User, message: Message): Promise<Message> {
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('messages')
      .add({
        uid: user.uid,
        author: user.name,
        body: message.body
      })
      .then(docRef => {
        return new Message(new Id(docRef.id), new Body(message.body))
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('メッセージの投稿に失敗しました')
      })
  }

  public getMessages(roomid: RoomId): Promise<Messages> {
    // TODO 上限
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('messages')
      .get()
      .then(query => {
        const messages: Message[] = []
        query.forEach(doc => {
          messages.push(this.createMessageObjectByMessageDoc(doc))
        })

        return new Messages(messages)
      })
  }

  private createMessageObject(id: string, body: string): Message {
    return new Message(new Id(id), new Body(body))
  }

  private createMessageObjectByMessageDoc(
    doc: firebase.firestore.DocumentSnapshot
  ): Message {
    const data: any = doc.data()
    if (doc.exists && data) {
      return this.createMessageObject(data.uid, data.name)
    } else {
      throw new ApplicationError('メッセージが存在しません')
    }
  }
}

export default MessageRepository

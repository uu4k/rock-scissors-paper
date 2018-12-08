import MessageRepositoryInterface from '../message-repository-interface'
import RoomId from '@/models/open/room/id'
import Message from '@/models/post/message/message'
import Messages from '@/models/post/messages'
import firebase from 'firebase/app'
import User from '@/models/entry/user/user'
import Id from '@/models/post/message/id'
import Body from '@/models/post/message/body'
import { inject, injectable } from 'inversify'
import Change from '@/models/post/changes/change'
import TYPE_IDENTIFIER from '@/models/post/changes/type-identifier'

@injectable()
class MessageRepository implements MessageRepositoryInterface {
  constructor(
    @inject('db')
    private db: firebase.firestore.Firestore
  ) {}

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

  public onMessagesChanged(roomid: RoomId, sync: (change: Change) => void) {
    this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('messages')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const message = this.createMessageObjectByMessageDoc(change.doc)
          if (change.type === 'added') {
            sync(new Change(TYPE_IDENTIFIER.ADDED, message))
          }
          if (change.type === 'modified') {
            sync(new Change(TYPE_IDENTIFIER.MODIFIED, message))
          }
          if (change.type === 'removed') {
            sync(new Change(TYPE_IDENTIFIER.REMOVED, message))
          }
        })
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
      return this.createMessageObject(doc.id, data.body)
    } else {
      throw new ApplicationError('メッセージが存在しません')
    }
  }
}

export default MessageRepository

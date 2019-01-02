import MessageRepositoryInterface from '../message-repository-interface'
import RoomId from '@/models/open/room/id'
import Message from '@/models/post/message/message'
import Messages from '@/models/post/messages'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import User from '@/models/entry/user/user'
import Id from '@/models/post/message/id'
import { inject, injectable } from 'inversify'
import Change from '@/models/post/changes/change'
import TYPE_IDENTIFIER from '@/models/post/changes/type-identifier'
import Uid from '@/models/entry/user/uid'
import ApplicationError from '@/error/application-error'

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
        body: message.body,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        return docRef.get().then(doc => {
          return this.createMessageObjectByMessageDoc(doc)
        })
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
      .orderBy('created_at', 'asc')
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
      .orderBy('created_at', 'asc')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const message = this.createMessageObjectByMessageDoc(change.doc)
          // TODO OCP違反
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

  private createMessageObject(
    id: string,
    body: string,
    uid: string,
    author: string,
    createdAt: Date
  ): Message {
    return new Message(new Id(id), body, new Uid(uid), author, createdAt)
  }

  private createMessageObjectByMessageDoc(
    doc: firebase.firestore.DocumentSnapshot
  ): Message {
    const data: firebase.firestore.DocumentData | undefined = doc.data()
    if (doc.exists && data) {
      const createdAt = data.created_at
        ? new Date(data.created_at.seconds * 1000)
        : new Date()
      return this.createMessageObject(
        doc.id,
        data.body,
        data.uid,
        data.author,
        createdAt
      )
    } else {
      throw new ApplicationError('メッセージが存在しません')
    }
  }
}

export default MessageRepository

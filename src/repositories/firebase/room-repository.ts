import RoomRepositoryInterface from '../room-repository-interface'
import Room from '@/models/open/room/room'
import Id from '@/models/open/room/id'
import { inject, injectable } from 'inversify'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
@injectable()
class RoomRepository implements RoomRepositoryInterface {
  constructor(
    @inject('db')
    private db: firebase.firestore.Firestore
  ) {}

  public open(): Promise<Room> {
    return this.db
      .collection('rooms')
      .add({
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        return this.createRoomObject(docRef.id)
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('ルームの開設に失敗しました')
      })
  }

  public exists(roomid: Id): Promise<boolean> {
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .get()
      .then(doc => {
        return doc.exists
      })
  }

  private createRoomObject(id: string): Room {
    return new Room(new Id(id))
  }
}

export default RoomRepository

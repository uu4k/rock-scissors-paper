import RoomRepositoryInterface from '../room-repository-interface'
import Room from '@/models/open/room/room'
import Id from '@/models/open/room/id'

class RoomRepository implements RoomRepositoryInterface {
  constructor(private db: firebase.firestore.Firestore) {}

  public open(): Promise<Room> {
    return this.db
      .collection('rooms')
      .add({})
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

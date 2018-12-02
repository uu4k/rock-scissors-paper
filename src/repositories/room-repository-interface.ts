import Room from '@/models/open/room/room'
import Id from '@/models/open/room/id'

interface RoomRepositoryInterface {
  open(): Promise<Room>
  exists(id: Id): Promise<boolean>
}

export default RoomRepositoryInterface

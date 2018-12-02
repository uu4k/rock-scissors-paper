import Room from '@/models/open/room/room'
import RoomRepositoryInterface from '@/repositories/room-repository-interface'

class OpenService {
  constructor(private roomRepository: RoomRepositoryInterface) {}

  public openRoom(): Promise<Room> {
    return this.roomRepository.open()
  }
}

export default OpenService

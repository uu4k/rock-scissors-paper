import Room from '@/models/open/room/room'
import RoomRepositoryInterface from '@/repositories/room-repository-interface'
import { inject, injectable } from 'inversify'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'

@injectable()
class OpenService {
  constructor(
    @inject(REPOSITORY_IDENTIFIER.ROOM)
    private roomRepository: RoomRepositoryInterface
  ) {}

  public openRoom(): Promise<Room> {
    return this.roomRepository.open()
  }
}

export default OpenService

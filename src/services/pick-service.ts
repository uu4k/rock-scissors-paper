import { injectable, inject } from 'inversify'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'
import Battle from '@/models/outbreak/battle/battle'
import RoomId from '@/models/open/room/id'
import User from '@/models/entry/user/user'
import Hand from '@/models/pick/hand/hand'
import BattleRepositoryInterface from '@/repositories/battle-repository-interface'

@injectable()
class PickService {
  constructor(
    @inject(REPOSITORY_IDENTIFIER.BATTLE)
    private battleRepository: BattleRepositoryInterface
  ) {}

  public pick(
    roomid: string,
    battle: Battle,
    user: User,
    hand: Hand
  ): Promise<void> {
    return this.isPicked(roomid, battle, user).then((isPicked: boolean) => {
      if (isPicked) {
        throw new ApplicationError('すでに手を出しています')
      }

      return this.battleRepository.pick(new RoomId(roomid), battle, user, hand)
    })
  }

  public isPicked(
    roomid: string,
    battle: Battle,
    user: User
  ): Promise<boolean> {
    return this.battleRepository.isPicked(new RoomId(roomid), battle, user)
  }
}

export default PickService

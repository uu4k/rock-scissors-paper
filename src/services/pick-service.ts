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
    roomid: RoomId,
    battle: Battle,
    user: User,
    hand: Hand
  ): Promise<void> {
    return this.battleRepository.pick(roomid, battle, user, hand)
  }
}

export default PickService

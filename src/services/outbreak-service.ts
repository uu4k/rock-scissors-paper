import { injectable, inject } from 'inversify'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'
import Battle from '@/models/outbreak/battle/battle'
import RoomId from '@/models/open/room/id'
import BattleRepositoryInterface from '@/repositories/battle-repository-interface'

@injectable()
class OutbreakService {
  constructor(
    @inject(REPOSITORY_IDENTIFIER.BATTLE)
    private battleRepository: BattleRepositoryInterface
  ) {}

  public outbreak(roomid: string): Promise<Battle> {
    // TODO すでにじゃんけん始まっていないか確認
    return this.battleRepository.outbreak(new RoomId(roomid))
  }

  public setBattleSynchronizer(
    roomid: string,
    actionForOpened: (openedBattle: Battle) => void,
    actionForClosed: (closedBattle?: Battle) => void
  ): void {
    return this.battleRepository.onBattleStateChanged(
      new RoomId(roomid),
      actionForOpened,
      actionForClosed
    )
  }
}

export default OutbreakService

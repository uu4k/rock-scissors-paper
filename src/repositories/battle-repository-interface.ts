import RoomId from '@/models/open/room/id'
import Battle from '@/models/outbreak/battle/battle'
import User from '@/models/entry/user/user'
import Hand from '@/models/pick/hand/hand'

interface BattleRepositoryInterface {
  outbreak(roomid: RoomId): Promise<Battle>
  pick(roomid: RoomId, battle: Battle, user: User, hand: Hand): Promise<void>
  onBattleStateChanged(
    roomid: RoomId,
    actionForOpened: (openedBattle?: Battle) => void,
    actionForClosed: (closedBattle?: Battle) => void
  ): void
}

export default BattleRepositoryInterface

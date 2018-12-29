import BattleRepositoryInterface from '../battle-repository-interface'
import RoomId from '@/models/open/room/id'
import Battle from '@/models/outbreak/battle/battle'
import User from '@/models/entry/user/user'
import Hand from '@/models/pick/hand/hand'
import { injectable, inject } from 'inversify'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import Id from '@/models/outbreak/battle/id'

@injectable()
class BattleRepository implements BattleRepositoryInterface {
  constructor(
    @inject('db')
    private db: firebase.firestore.Firestore
  ) {}

  public outbreak(roomid: RoomId): Promise<Battle> {
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('battles')
      .add({
        state: 'open',
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        return docRef.get().then(doc => {
          return this.createBattleObjectByBattleDoc(doc)
        })
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('じゃんけんの開始に失敗しました')
      })
  }

  public pick(
    roomid: RoomId,
    battle: Battle,
    user: User,
    hand: Hand
  ): Promise<void> {
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('battles')
      .doc(battle.id)
      .collection('hands')
      .add({
        hand: hand.key,
        author: user.name,
        uid: user.uid,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        return
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('手の入力に失敗しました')
      })
  }

  public isPicked(roomid: RoomId, battle: Battle, user: User) {
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('battles')
      .doc(battle.id)
      .collection('hands')
      .where('uid', '==', user.uid)
      .get()
      .then(docs => {
        return !docs.empty
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('手の取得に失敗しました')
      })
  }

  public onBattleStateChanged(
    roomid: RoomId,
    actionForOpened: (currentBattle: Battle) => void,
    actionForClosed: (currentBattle?: Battle) => void
  ): void {
    // TODO コレクション自体のsubscriber(戦闘開始観測)とバトル単体のsubscriber(戦闘終了観測)分ける？
    this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('battles')
      .orderBy('created_at', 'desc')
      .limit(1) // TODO limitしててもコレクションの変更取れる？
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          // TODO OCP違反
          const battle = this.createBattleObjectByBattleDoc(change.doc)
          if (change.type === 'added' && battle.opened) {
            // じゃんけん開始
            actionForOpened(battle)

            // じゃんけん終了時の処理仕込み
            const closedSubscriber = this.db
              .collection('rooms')
              .doc(roomid.id)
              .collection('battles')
              .doc(battle.id)
              .onSnapshot(battleDoc => {
                const modifiedBattle = this.createBattleObjectByBattleDoc(
                  battleDoc
                )
                if (!modifiedBattle.opened) {
                  // じゃんけん終了
                  actionForClosed(modifiedBattle)
                  closedSubscriber() // 終了のsubscribe停止
                }
              })
          }
        })
      })
  }

  private createBattleObject(id: string, opened: boolean): Battle {
    return new Battle(new Id(id), opened)
  }

  private createBattleObjectByBattleDoc(
    doc: firebase.firestore.DocumentSnapshot
  ): Battle {
    const data: firebase.firestore.DocumentData | undefined = doc.data()
    if (doc.exists && data) {
      return this.createBattleObject(doc.id, data.state === 'open')
    } else {
      throw new ApplicationError('メッセージが存在しません')
    }
  }
}

export default BattleRepository

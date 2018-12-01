import UserRepositoryInterface from '../user-repository-interface'
import User from '@/models/room/user/user'
import Uid from '@/models/room/user/uid'
import Name from '@/models/room/user/name'
import RoomId from '@/models/room/id'

import firebase from 'firebase/app'
import 'firebase/auth'

class UserRepository implements UserRepositoryInterface {
  constructor(private db: firebase.firestore.Firestore) {}

  public login(roomid: RoomId) {
    return firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        throw new ApplicationError('ユーザー情報の初期化に失敗しました')
      })
      .then(cred => {
        if (cred.user) {
          const userForSave = new User(new Uid(cred.user.uid))
          return this.saveUser(roomid, userForSave)

          // TODO ユーザ情報の自動同期設定も入れる
        } else {
          throw new ApplicationError('ユーザー情報の初期化に失敗しました')
        }
      })
  }

  public logout() {
    return firebase.auth().signOut()
  }

  public getUser(roomid: RoomId, uid: Uid) {
    console.log(uid.uid)
    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('users')
      .doc(uid.uid)
      .get()
      .then(doc => {
        return this.createUserObjectByUserDoc(doc)
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('ユーザー情報の取得に失敗しました')
      })
  }

  public saveUser(roomid: RoomId, user: User) {
    const userdata: any = {
      uid: user.uid
    }
    if (user.name) {
      userdata.name = user.name
    }

    return this.db
      .collection('rooms')
      .doc(roomid.id)
      .collection('users')
      .doc(user.uid)
      .set(userdata, { merge: true })
      .then(() => {
        // 一応再取得
        return this.getUser(roomid, new Uid(user.uid))
      })
      .catch(error => {
        console.log(error)
        throw new ApplicationError('ユーザー情報の登録に失敗しました')
      })
  }

  // public setUserName(name: Name) {
  //   if (this._user) {
  //     this._user = new User(this._user.uid, name)

  //     return this.getUser()
  //   } else {
  //     throw new ApplicationError('ユーザー情報が存在しません')
  //   }
  // }

  private createUserObject(uid: string, name?: string): User {
    const argUid = new Uid(uid)
    const argName = name ? new Name(name) : undefined

    // TODO factory化
    const user = new User(argUid, argName)
    Object.freeze(user)
    return user
  }

  private createUserObjectByUserDoc(
    doc: firebase.firestore.DocumentSnapshot
  ): User {
    const data: any = doc.data()
    if (doc.exists && data) {
      return this.createUserObject(data.uid, data.name)
    } else {
      throw new ApplicationError('ユーザー情報が存在しません')
    }
  }
}

export default UserRepository

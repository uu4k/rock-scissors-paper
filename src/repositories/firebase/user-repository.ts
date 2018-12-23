import UserRepositoryInterface from '../user-repository-interface'
import User from '@/models/entry/user/user'
import Uid from '@/models/entry/user/uid'
import RoomId from '@/models/open/room/id'

import firebase from 'firebase/app'
import 'firebase/auth'
import { inject, injectable } from 'inversify'
import Room from '@/models/open/room/room'

@injectable()
class UserRepository implements UserRepositoryInterface {
  constructor(
    @inject('db')
    private db: firebase.firestore.Firestore
  ) {}

  public login(roomid: RoomId): Promise<void> {
    return firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        throw new ApplicationError('ユーザー情報の初期化に失敗しました')
      })
      .then(() => {
        return
      })
  }

  public logout(): Promise<void> {
    return firebase.auth().signOut()
  }

  public getUser(roomid: RoomId, uid: Uid): Promise<User> {
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

  public saveUser(roomid: RoomId, user: User): Promise<User> {
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

  public onAuthChanged(roomid: RoomId, action: (user?: User) => void): void {
    firebase.auth().onAuthStateChanged(fbuser => {
      if (fbuser) {
        const userForSave = new User(new Uid(fbuser.uid))
        this.saveUser(roomid, userForSave).then(() => {
          this.getUser(roomid, new Uid(fbuser.uid)).then(user => {
            action(user)
          })
        })
      } else {
        action(undefined)
      }
    })
  }

  private createUserObject(uid: string, name?: string): User {
    const argUid = new Uid(uid)
    const argName = name ? name : undefined

    // TODO factory化
    return new User(argUid, argName)
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

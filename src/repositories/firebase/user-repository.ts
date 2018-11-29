import UserRepositoryInterface from '../user-repository-interface'
import User from '@/models/user/user'
import Uid from '@/models/user/uid'
import Name from '@/models/user/name'

import firebase from 'firebase/app'
import 'firebase/auth'

class UserRepository implements UserRepositoryInterface {
  constructor(private db: firebase.firestore.Firestore) {}

  public login() {
    return firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        throw new ApplicationError('ユーザー情報の初期化に失敗しました')
      })
      .then(cred => {
        if (cred.user) {
          const userForSave = new User(new Uid(cred.user.uid))
          return this.saveUser(userForSave)

          // TODO ユーザ情報の自動同期設定も入れる
        } else {
          throw new ApplicationError('ユーザー情報の初期化に失敗しました')
        }
      })
  }

  public logout() {
    return firebase.auth().signOut()
  }

  public getUser(uid: Uid) {
    return this.db
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

  public saveUser(user: User) {
    let setData: any = {
      uid: user.uid
    }
    if (user.name) {
      setData.name = user.name
    }

    return this.db
      .collection('users')
      .doc(user.uid)
      .set(setData, { merge: true })
      .then(() => {
        console.log('add new user!')

        // 一応再取得
        return this.getUser(new Uid(user.uid))
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

  private createUserObject(uid: string, name?: string) {
    const argUid = new Uid(uid)
    const argName = name ? new Name(name) : undefined

    return new User(argUid, argName)
  }

  private createUserObjectByUserDoc(doc: firebase.firestore.DocumentSnapshot) {
    const data: any = doc.data()
    if (doc.exists && data) {
      console.log('Document data:', data)

      return this.createUserObject(data.uid, data.name)
    } else {
      throw new ApplicationError('ユーザー情報が存在しません')
    }
  }
}

export default UserRepository

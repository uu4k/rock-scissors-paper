import UserRepositoryInterface from '../user-repository-interface'
import User from '@/models/user/user'
import Uid from '@/models/user/uid'
import Name from '@/models/user/name'

import firebase from 'firebase/app'
import 'firebase/auth'

class UserRepository implements UserRepositoryInterface {
  private _user?: User

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // var isAnonymous = user.isAnonymous
        // TODO いる？
        if (this._user) {
          this._user = new User(new Uid(user.uid), new Name('UNKNOWN'))
        }
      } else {
        this._user = undefined
      }
    })
  }

  public login() {
    return firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        throw new ApplicationError('ユーザー情報の初期化に失敗しました')
      })
      .then(cred => {
        console.log('signInAnonymously')
        if (cred.user) {
          this._user = new User(new Uid(cred.user.uid), new Name('UNKNOWN'))
          return this._user
        } else {
          throw new ApplicationError('ユーザー情報の初期化に失敗しました')
        }
      })
  }

  public logout() {
    return firebase.auth().signOut()
  }

  public loggedin() {
    return !!this._user
  }

  public getUser() {
    return this._user
  }
}

export default UserRepository

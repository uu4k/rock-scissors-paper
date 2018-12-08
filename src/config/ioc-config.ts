import 'reflect-metadata'

import { Container } from 'inversify'

import OpenService from '@/services/open-service'
import PostService from '@/services/post-service'
import EntryService from '@/services/entry-service'
import RoomRepositoryInterface from '@/repositories/room-repository-interface'
import UserRepositoryInterface from '@/repositories/user-repository-interface'
import MessageRepositoryInterface from '@/repositories/message-repository-interface'
import UserRepository from '@/repositories/firebase/user-repository'
import RoomRepository from '@/repositories/firebase/room-repository'
import MessageRepository from '@/repositories/firebase/message-repository'

import SERVICE_IDENTIFIER from '@/constants/service-identifier'
import REPOSITORY_IDENTIFIER from '@/constants/repository-identifier'
import '@/config/firebase'
import firebase from 'firebase'

let container = new Container()
const db = firebase.firestore()

container.bind<firebase.firestore.Firestore>('db').toConstantValue(db)

container
  .bind<RoomRepositoryInterface>(REPOSITORY_IDENTIFIER.ROOM)
  .to(RoomRepository)
  .whenTargetIsDefault()

container
  .bind<UserRepositoryInterface>(REPOSITORY_IDENTIFIER.USER)
  .to(UserRepository)
  .whenTargetIsDefault()

container
  .bind<MessageRepositoryInterface>(REPOSITORY_IDENTIFIER.MESSAGE)
  .to(MessageRepository)
  .whenTargetIsDefault()

container
  .bind<OpenService>(SERVICE_IDENTIFIER.OPEN)
  .to(OpenService)
  .whenTargetIsDefault()

container
  .bind<PostService>(SERVICE_IDENTIFIER.POST)
  .to(PostService)
  .whenTargetIsDefault()

container
  .bind<EntryService>(SERVICE_IDENTIFIER.ENTRY)
  .to(EntryService)
  .whenTargetIsDefault()

export default container

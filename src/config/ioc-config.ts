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
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import OutbreakService from '@/services/outbreak-service'
import PickService from '@/services/pick-service'
import BattleRepositoryInterface from '@/repositories/battle-repository-interface'
import BattleRepository from '@/repositories/firebase/battle-repository'
import HandFactory from '@/models/pick/hand-factory'

const container = new Container()
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
  .bind<BattleRepositoryInterface>(REPOSITORY_IDENTIFIER.BATTLE)
  .to(BattleRepository)
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

container
  .bind<OutbreakService>(SERVICE_IDENTIFIER.OUTBREAK)
  .to(OutbreakService)
  .whenTargetIsDefault()

container
  .bind<PickService>(SERVICE_IDENTIFIER.PICK)
  .to(PickService)
  .whenTargetIsDefault()

container
  .bind<HandFactory>(HandFactory.name)
  .to(HandFactory)
  .whenTargetIsDefault()

export default container

import Type from './type'
import Message from '../message/message'

class Change {
  constructor(public type: Type, public message: Message) {}
}

export default Change

import Message from './message/message'
import { id } from 'inversify'

class Messages {
  constructor(private _messages: Message[] = []) {}

  public asList(): never[] & Message[] {
    // 不変にしたものを返す
    const messages = Object.assign([], this._messages)
    Object.freeze(messages)
    return messages
  }

  public add(message: Message): Messages {
    // 不変とするために追加したオブジェクトを別途作成して返す
    const newMessageArray: Message[] = Object.assign([], this._messages)
    newMessageArray.push(message)
    return new Messages(newMessageArray)
  }

  public remove(message: Message): Messages {
    const newMessageArray: Message[] = Object.assign([], this._messages)
    const deleteIndex = newMessageArray.findIndex(
      (temporaryMessage: Message) => {
        return temporaryMessage.id === message.id
      }
    )
    newMessageArray.splice(deleteIndex, 1)
    return new Messages(newMessageArray)
  }

  public modify(message: Message): Messages {
    const newMessageArray: Message[] = Object.assign([], this._messages)
    const modifyIndex = newMessageArray.findIndex(
      (temporaryMessage: Message) => {
        return temporaryMessage.id === message.id
      }
    )
    if (modifyIndex === -1) {
      return this
    }

    newMessageArray[modifyIndex] = message
    return new Messages(newMessageArray)
  }
}

export default Messages

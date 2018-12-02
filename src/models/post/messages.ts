import Message from './message/message'

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
    const newmessages = Object.assign([], this._messages)
    newmessages.push(message)
    return new Messages(newmessages)
  }
}

export default Messages

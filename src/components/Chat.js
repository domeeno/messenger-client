import React, {useState, useCallback, useEffect} from 'react'


const Chat = () =>  {
  //updating contents of the message input as user types.
  const [messageTextBox, setMessageTextBox] = useState('')
  const [listOfMessages, setListOfMessages] = useState([])

  const onMessageInputChange = useCallback((event) => {
    console.log(event.target.value)
    setMessageTextBox(event.target.value)
  }, [])

  const sendMessage = useCallback((event) => {
    event.preventDefault()
    //print user that sent the message
    setListOfMessages([
      ...listOfMessages, 
      {
        id: listOfMessages.length + 1,
        content: messageTextBox,
        done: false,
      }
    ])

    setMessageTextBox("")
  }, [listOfMessages, messageTextBox])

  useEffect(() => {
    (async () => {
      const listOfFetchedMessages = await fetchMessages()
      console.log(listOfFetchedMessages)
    })();
    console.log(listOfMessages.length)
  }, [listOfMessages])



  return (
    <div className="chat-view"> 
      <ul className="chat-message-container">
        {listOfMessages.map((message) => (
          <li key={message.id} >{message.content}</li>
        ))}
      </ul>
      <h1>{fetchMessages}</h1>
      <form className="message-box" onSubmit={sendMessage}>
        <input onChange={onMessageInputChange} 
        placeholder="message"  
        id="msg"
        type="text"
        value={messageTextBox}
        // just ignore for the future input like = ""
        required 
        />
        <button className="btn">Send</button>
      </form>
    </div>
  ); 
}

export default Chat;

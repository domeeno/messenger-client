import React, {useState, useCallback, useEffect} from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import socketIOClient from "socket.io-client";
import Qs from "qs";
import {useLocation} from "react-router-dom";

const ENDPOINT = "http://100.100.100.114:8080";
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});


function Message() {
    // const chatForm = document.getElementById("chat-form");
    // const chatMessages = document.querySelector(".chat-messages");
    // const socket = io();
    const location = useLocation();
    const [messageTextBox, setMessageTextBox] = useState('')
    const [listOfMessages, setListOfMessages] = useState([])

    console.log(location)
    const token = localStorage.getItem("token")
    const room = "5fcd2e8a79c4ed27cc3d318d"
    // const { username, room } = Qs.parse(location.search, {
    //     ignoreQueryPrefix: true
    // });

    useEffect(() => {
        socket.emit("joinRoom", { token, room });
    }, [token, room])


    socket.on("message", message => {
        console.log("message", message);

        // outputMessage(message);
        // chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // socket.on("roomUsers", ({room, users}) => {
    //     outputRoomName(room);
    //     outputUsers(users);
    // })

    const onMessageInputChange = useCallback((event) => {
        console.log(event.target.value)
        setMessageTextBox(event.target.value)
    }, [])
    
    function prettyDate2(time){
        var date = new Date(parseInt(time));
        var localeSpecificTime = date.toLocaleTimeString();
        return localeSpecificTime.replace(/:\d+ /, ' ');
    }

    const Submit = useCallback((event) => {
        event.preventDefault();
        
        const msg = event.target.elements.msg.value


        socket.emit("chatMessage", msg);

        setListOfMessages([
            ...listOfMessages,
            {
                id: listOfMessages.length + 1,
                content: messageTextBox,
                time: prettyDate2(Date.now()),
                done: false,
            }
        ])

        setMessageTextBox("")
        // e.target.elements.msg.focus();
    }, [listOfMessages, messageTextBox]) 

    // function outputMessage(message) {
    //     const div = document.createElement('div');
    //     div.classList.add("message");
    //     div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    //     <p class="text">
    //     ${message.text}
    //     </p>`;
    //     document.querySelector(".chat-messages").appendChild(div)
    // }

    // function outputRoomName(room) {
        
    // }

    return (
            // <div className="chat-box-container">
            // <div className="chat-main">
            //     <div className="chat-messages">
            //         <ul className="chat-message-container">
            //             {listOfMessages.map((message) => (
            //                 <li key={message.id} > 
            //                 <span className="time-display"> {message.time} </span>  
            //                 <span className="username-display">{username}</span>
            //                 <span className="separator"> : </span>
            //                 <span className="message-display">{message.content}</span>
            //                 </li>
            //             ))}
            //         </ul>
            //     </div>
            // </div>
            // <div className="chat-form-container">
            //     <form id="chat-form" className="m-2" onSubmit={Submit}>
            //     <input 
            //         className="message-input-box"
            //         onChange={onMessageInputChange}
            //         id="msg"
            //         type="text"
            //         placeholder="Enter Message"
            //         value={messageTextBox}
            //         required
            //         autoComplete="off"
            //     />
            //     <button className="send-button"> Send</button>
            //     </form>
            // </div>
            // </div>
            
            <div className="chat-box-container d-flex flex-column flex-grow-1">
                <div className="flex-grow-1 overflow-auto">
                    <div className="h-100 d-flex flex-column align-items-start justify-content-end px-3">
                         { listOfMessages.map((message) => {
                                return(
                                    <div className="my-1 d-flex flex-column">
                                        <div key={message.id} > 
                                            <span className="time-display"> {message.time} </span>  
                                            <span className="username-display">PlaceHolder</span>
                                            <span className="separator"> : </span>
                                            <span className="message-display">{message.content}</span>
                                        </div>
                                    </div>
                                )
                            }
                         )}
                    </div>
                </div>
                <Form onSubmit={Submit}>
                    <Form.Group className="m-2">
                        <InputGroup>
                            <Form.Control 
                            className="chat-input-box"
                            onChange={onMessageInputChange}
                            required 
                            id="msg"
                            placeholder="Enter Message"
                            value={messageTextBox} 
                            autoComplete="off"
                            />
                            <InputGroup.Append>
                                <Button type="submit" className="chat-send-button">Send</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Form>
            </div>
    )
}

export default Message
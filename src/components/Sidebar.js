import React, {useState, useCallback} from 'react'
import socketIOClient from "socket.io-client";
import {useLocation} from "react-router-dom";

const ENDPOINT = "http://100.100.100.114:8080";
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});


function Sidebar () {
    const location = useLocation();
    const [contactBox, setContactInputBox] = useState([])
    const [contactList, setContactList] = useState([])

    const token = localStorage.getItem("token")

    const onContactInputChange = useCallback((event) => {
        console.log(event.target.value)
        setContactInputBox(event.target.value)
    }, [])

    const onContactInputSubmit = useCallback((event) => {
        event.preventDefault();

        const userToAdd = event.target.elements.userToAdd.value


        socket.emit("chatMessage", userToAdd);

        setContactList([
            ...contactList,
            {
                id: contactList.length + 1,
                username: contactBox,
                done: false,
            }
        ])

        setContactInputBox("")
    }, [contactList, contactBox])

    return (
        <div className="chat-sidebar">
            <h3 className="contacts-header">PlaceHolder</h3>
            <div id="add-contacts" className="add-contact-form">
                    <form id="chat-form" onSubmit={onContactInputSubmit}>
                        <input 
                            className="contact-input-box"
                            onChange={onContactInputChange}
                            id="userToAdd"
                            type="text"
                            placeholder="Search"
                            value={contactBox}
                            required
                            autoComplete="off"
                        />
                        <button className="add-button"><i className="fas fa-paper-plane"></i> Add</button>
                    </form>
                </div>
            <div id="contacts-box" className="contacts-list">
                <div className="user-contacts-container">
                    {contactList.map((contact) => {
                        return(
                            <div className="my-1 d-flex flex-column">
                                <div key={contact.id} > {contact.username} </div>
                            </div>
                        )}
                        )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
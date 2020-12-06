import React, {useState, useCallback, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import Qs from "qs";
import {useLocation} from "react-router-dom";

const ENDPOINT = "http://localhost:8000";
const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});


function Message() {
    // const chatForm = document.getElementById("chat-form");
    // const chatMessages = document.querySelector(".chat-messages");
    // const socket = io();
    const location = useLocation();

    console.log(location)
    const { username, room } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    });

    socket.emit("joinRoom", { username, room });

    socket.on("message", message => {
        console.log(message);

        // outputMessage(message);
        // chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // socket.on("roomUsers", ({room, users}) => {
    //     outputRoomName(room);
    //     outputUsers(users);
    // })

    function Submit(e) {
        e.preventDefault();

        const msg = e.target.elements.msg.value;

        socket.emit("chatMessage", msg);
        e.target.elements.msg.value = "";
        // e.target.elements.msg.focus();
    }

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
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
            integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
            crossorigin="anonymous"
            />
            <link rel="stylesheet" href="css/style.css" />
            <title>ChatCord App</title>
        </head>
        <body>
            <div class="chat-container">
            <header class="chat-header">
                <h1><i class="fas fa-smile"></i> ChatCord</h1>
                <a href="index.html" class="btn">Leave Room</a>
            </header>
            <main class="chat-main">
                <div class="chat-sidebar">
                <h3><i class="fas fa-comments"></i> Room Name:</h3>
                <h2 id="room-name"></h2>
                <h3><i class="fas fa-users"></i> Users</h3>
                <ul id="users"></ul>
                </div>
                <div class="chat-messages"></div>
            </main>
            <div class="chat-form-container">
                <form id="chat-form" onSubmit={Submit}>
                <input
                    id="msg"
                    type="text"
                    placeholder="Enter Message"
                    required
                    autocomplete="off"
                />
                <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
                </form>
            </div>
            </div>

            <script
            src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.2/qs.min.js"
            integrity="sha256-TDxXjkAUay70ae/QJBEpGKkpVslXaHHayklIVglFRT4="
            crossorigin="anonymous"
            ></script>
            {/* <script src="/socket.io/socket.io.js"></script> */}
            {/* <script src="js/main.js"></script> */}
        </body>
        </html>
    )
}

export default Message

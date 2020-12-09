import React from 'react';
import Sidebar from './Sidebar';
import Message from './Message';

//

export default function ChatView() {
  return (
    <div className="chat-container d-flex">
      <Sidebar />
      <Message />
    </div>
  );
}

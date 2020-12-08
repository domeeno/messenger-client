import React from 'react';

function ChooseChat() {
  return (
    <div className="join-container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile" />
          {' '}
          ChatCord
        </h1>
      </header>
      <main className="join-main">
        <form action="chat">
          <div className="form-control">
            <label htmlFor="username">
              Username
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter username..."
                required
              />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="room">
              Room
              <select className="room" id="room">
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="PHP">PHP</option>
                <option value="C#">C#</option>
                <option value="Ruby">Ruby</option>
                <option value="Java">Java</option>
              </select>
            </label>
          </div>
          <button type="submit" className="btn">Join Chat</button>
        </form>
      </main>
    </div>
  );
}

export default ChooseChat;

import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ChatRoom1, ChatRoom2, ChatRoom3, ChatHome, ChatRoom4 } from ".";

function Messages(props) {
    return (
        <div>
            <Routes>
                <Route path="/" element={<ChatHome />} />
                <Route path="/chatroom1" element={<ChatRoom1 />} />
                <Route path="/chatroom2" element={<ChatRoom2 />} />
                <Route path="/chatroom3" element={<ChatRoom3 />} />
                <Route path="/chatroom4" element={<ChatRoom4 />} />
            </Routes>
        </div>
    );
}

export default Messages;

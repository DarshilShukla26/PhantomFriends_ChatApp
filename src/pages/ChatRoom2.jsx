import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ChatData, ChatInput } from "../components";
import { auth, db } from "../firebase-config";

function ChatRoom2(props) {
    const [chat, setChat] = useState([]);

    const chatCollectionsRef = collection(db, "chatroom2");
    const q = query(chatCollectionsRef, orderBy("timestamp", "asc"));

    useEffect(() => {
        const unsub = onSnapshot(q, (snapshot) => {
            setChat(
                snapshot.docs.map((chat) => ({ ...chat.data(), id: chat.id }))
            );
            window.scrollTo(0, document.body.scrollHeight);
        });
        return unsub;
    }, []);

    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        setMessage("");
        await addDoc(chatCollectionsRef, {
            author: auth?.currentUser?.email,
            text: message,
            timestamp: serverTimestamp(),
        });
        window.scrollTo(0, document.body.scrollHeight);
    };

    return (
        <>
            <div className="main-title">
                <h2>Chat Room 2</h2>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {chat.map((chat) => (
                    <ChatData chat={chat} key={chat.id} />
                ))}
            </div>

            <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
            />
        </>
    );
}

export default ChatRoom2;

import { Paper } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChatRoomOptions({ chatRoomNumber, chatName, backgroundImg, route }) {
    const navigate = useNavigate();

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: "cover",
            }}
            onClick={() => {
                navigate(route);
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    aspectRatio: "1/1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    transition: "opacity 0.3s",
                    ":hover": { opacity: "0" },
                }}
            >
                <h2>Chat Room {chatRoomNumber} -</h2>
                <h1>{chatName}</h1>
            </Paper>
        </div>
    );
}

export default ChatRoomOptions;

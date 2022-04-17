import { Box } from "@mui/material";
import React, { useState } from "react";
import { ChatRoomOptions } from "../components";

function ChatHome(props) {
    return (
        <>
            <div className="main-title">
                <h2>Chat Rooms</h2>
            </div>
            <Box
                sx={{
                    padding: "1rem",
                    gap: "1rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    "@media(max-width: 600px)": {
                        gridTemplateColumns: "1fr",
                    },
                }}
            >
                <ChatRoomOptions
                    chatRoomNumber="1"
                    chatName="World War 3"
                    backgroundImg="https://steamuserimages-a.akamaihd.net/ugc/784109274573364001/D6C22DE592194B58FB62E2770842D556649ABAE5/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
                    route="/messages/chatroom1"
                />
                <ChatRoomOptions
                    chatRoomNumber="2"
                    chatName="Dev Chat"
                    backgroundImg="https://c.tenor.com/VFFJ8Ei3C2IAAAAM/rickroll-rick.gif"
                    route="/messages/chatroom2"
                />
                <ChatRoomOptions
                    chatRoomNumber="3"
                    chatName="Random Chat"
                    backgroundImg="https://c.tenor.com/VnXrA1Xypu0AAAAC/its-a-trap.gif"
                    route="/messages/chatroom3"
                />
                <ChatRoomOptions
                    chatRoomNumber="4"
                    chatName="Jokes Chat"
                    backgroundImg="https://c.tenor.com/UDuX3ItlZwkAAAAM/it-was-a-joke-mr-hankey.gif"
                    route="/messages/chatroom4"
                />
            </Box>
        </>
    );
}

export default ChatHome;

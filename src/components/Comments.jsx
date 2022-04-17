import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import { deleteDoc, doc } from "firebase/firestore";

function Comments({ comment, tweetId }) {
    const name = comment.author.substring(0, comment.author.lastIndexOf("@"));
    const date = comment.timestamp?.toDate()?.toDateString();
    const fullNameEmail = comment.author;
    const commentId = comment.id;
    const commentText = comment.text;

    const handleDeleteButton = async () => {
        const specificCommentRef = doc(
            db,
            "tweets",
            tweetId,
            "comments",
            commentId
        );
        await deleteDoc(specificCommentRef);
    };

    return (
        <div>
            <div style={{ display: "flex", padding: "1rem", gap: "1rem" }}>
                <Avatar />
                <div style={{ flex: "1" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <h3 style={{ wordBreak: "break-word" }}>
                                {name.length > 13
                                    ? name.substring(0, 13) + "..."
                                    : name}
                                <span style={{ fontWeight: "400" }}>
                                    @
                                    {name.length > 13
                                        ? name.substring(0, 13) + "..."
                                        : name}{" "}
                                    · {date}
                                </span>
                            </h3>
                        </div>
                        {auth?.currentUser?.email == fullNameEmail && (
                            <DeleteForeverTwoToneIcon
                                fontSize="small"
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    handleDeleteButton(commentId);
                                }}
                            />
                        )}
                      
                    </div>
                    <h4
                        style={{
                            fontWeight: "400",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {commentText}
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default Comments;

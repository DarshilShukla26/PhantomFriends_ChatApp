import { Avatar } from "@mui/material";
import {
    collection,
    getDocs,
    query,
    where,
    onSnapshot,
    doc,
    deleteDoc,
    orderBy,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import Tooltip from "@mui/material/Tooltip";

function Bookmarks({}) {
    const [bookmarkedTweets, setBookmarkedTweets] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(async () => {
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(
            usersCollectionRef,
            where("user", "==", auth?.currentUser?.email)
        );
        const registeredUsersData = await getDocs(usersQuery);
        const userId = registeredUsersData.docs.map((users) => ({
            ...users.data(),
            id: users.id,
        }));
        const bookmarkCollectionRef = collection(
            db,
            "users",
            userId[0]?.id,
            "bookmarks"
        );
        const bookmarkQuery = query(
            bookmarkCollectionRef,
            orderBy("dateBookmarked", "desc")
        );
        setUserId(userId[0]?.id);
        const unsub = onSnapshot(bookmarkQuery, (snapshot) => {
            setBookmarkedTweets(
                snapshot.docs.map((bookmarks) => ({
                    ...bookmarks.data(),
                    id: bookmarks.id,
                }))
            );
        });
        return unsub;
    }, []);

    const handleDeleteButton = async (id) => {
        const targetTweetRef = doc(db, "users", userId, "bookmarks", id);
        await deleteDoc(targetTweetRef);
    };

    return (
        <div>
            <div className="main-title">
                <h2>Bookmarks</h2>
            </div>
            {bookmarkedTweets.map((bookmark) => (
                <div
                    style={{ display: "flex", padding: "1rem", gap: "1rem" }}
                    key={bookmark.id}
                >
                    <Avatar />
                    <div style={{ flex: "1" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h3 style={{ wordBreak: "break-word" }}>
                                {bookmark.author.substring(
                                    0,
                                    bookmark.author.lastIndexOf("@")
                                )}
                                <span
                                    style={{
                                        fontWeight: "400",
                                    }}
                                >
                                    @
                                    {bookmark.author.substring(
                                        0,
                                        bookmark.author.lastIndexOf("@")
                                    )}{" "}
                                    · {bookmark.date}
                                </span>
                            </h3>
                            <Tooltip title="Remove Bookmark">
                                <BookmarkRemoveIcon
                                    fontSize="small"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                        handleDeleteButton(bookmark.id);
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <h4
                            style={{
                                fontWeight: "400",
                                marginBottom: "0.5rem",
                            }}
                        >
                            {bookmark.tweetText}
                        </h4>
                        {bookmark.imgSrc && (
                            <img
                                width={"100%"}
                                src={bookmark.imgSrc}
                                alt=""
                                style={{ borderRadius: "1rem" }}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Bookmarks;

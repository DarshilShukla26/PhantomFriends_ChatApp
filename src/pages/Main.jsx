import { bgcolor, Box } from "@mui/system";
import {
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Tweet, TweetBox, TweetHeader } from "../components";
import { auth, db } from "../firebase-config";
import Alert from "@mui/material/Alert";

function Main({ allUsers }) {
    const [tweets, setTweets] = useState([]);

    const [queryLimit, setQueryLimit] = useState(10);

    const tweetCollectionRef = collection(db, "tweets");
    const q = query(
        tweetCollectionRef,
        orderBy("date", "desc"),
        limit(queryLimit)
    );

    useEffect(() => {
        const unsub = onSnapshot(q, (snapshot) => {
            setTweets(
                snapshot.docs.map((tweets) => ({
                    ...tweets.data(),
                    id: tweets.id,
                }))
            );
        });
        return unsub;
    }, [queryLimit]);

    const [showCopyToClipboardAlert, setShowCopyToClipboardAlert] =
        useState(false);

    const [showAddToBookmarksAlert, setShowAddToBookmarksAlert] =
        useState(false);

    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(async () => {
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(
            usersCollectionRef,
            where("user", "==", auth?.currentUser?.email)
        );
        const registeredUsersData = await getDocs(usersQuery);
        setRegisteredUsers(
            registeredUsersData.docs.map((users) => ({
                ...users.data(),
                id: users.id,
            }))
        );
    }, []);

    return (
        <div>
            <TweetHeader />
            <TweetBox allUsers={allUsers} />
            {tweets.map((tweet, index) => (
                <Tweet
                    key={tweet.id}
                    tweetCollectionRef={tweetCollectionRef}
                    tweetId={tweet.id}
                    fullNameEmail={tweet.author}
                    name={tweet.author.substring(
                        0,
                        tweet.author.lastIndexOf("@")
                    )}
                    date={tweet.date?.toDate()?.toDateString()}
                    tweetText={tweet.tweetText}
                    imgSrc={tweet.imgSrc}
                    likes={tweet.likes}
                    retweets={tweet.retweets}
                    setShowCopyToClipboardAlert={setShowCopyToClipboardAlert}
                    setShowAddToBookmarksAlert={setShowAddToBookmarksAlert}
                    registeredUsers={registeredUsers}
                    allUsers={allUsers}
                />
            ))}
            {/* Image Url Copied to Clipboard Alert */}
            <Alert
                severity="success"
                sx={{
                    position: "fixed",
                    top: "80%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: !showCopyToClipboardAlert && "none",
                }}
            >
                Image Url Added to Clipboard
            </Alert>
            <Alert
                severity="success"
                sx={{
                    position: "fixed",
                    top: "80%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: !showAddToBookmarksAlert && "none",
                }}
            >
                Tweet Added to Bookmarks
            </Alert>
            {/* Load more tweets at bottom */}
            {tweets.length + 1 > queryLimit && (
                <Box
                    onClick={() => {
                        setQueryLimit((prevValue) => prevValue + 10);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "75px",
                        cursor: "pointer",
                        color: "#43ABF2",
                        transition: "background 0.25s",
                        "&:hover": {
                            backgroundColor: "rgb(29,155,240, .1)",
                        },
                    }}
                >
                    Show More
                </Box>
            )}
        </div>
    );
}

export default Main;

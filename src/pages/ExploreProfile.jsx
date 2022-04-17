import { Box } from "@mui/material";
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Tweet } from "../components";
import { db } from "../firebase-config";

function ExploreProfile({ profileSearch, registeredUsers, allUsers }) {
    const [tweets, setTweets] = useState([]);

    const [queryLimit, setQueryLimit] = useState(10);

    const tweetCollectionRef = collection(db, "tweets");
    const q = query(
        tweetCollectionRef,
        limit(queryLimit),
        where("author", "==", profileSearch)
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

    return (
        <div>
            {tweets.length == 0 && <div>No Data</div>}
            {tweets.map((tweet) => (
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

            {/* Show More Button */}
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

export default ExploreProfile;

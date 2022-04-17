import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Button, Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import {
    addDoc,
    collection,
    serverTimestamp,
    setDoc,
    doc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const Filter = require("bad-words");
const filter = new Filter();

function TweetBox({ allUsers }) {
    // Ref to File Input
    const hiddenFileInput = React.useRef(null);

    const handleMediaButton = () => {
        // Call File Input
        hiddenFileInput.current.click();
    };

    const [file, setFile] = useState(null);
    const [fileSelectError, setFileSelectError] = useState(null);

    const handleSelectedFile = (e) => {
        const selectedFile = e.target.files[0];
        const allowedFileTypes = [
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/gif",
        ];
        // 1mb = 1,000,000 bytes
        const allowedFileSize = Number("5000000");
        if (
            selectedFile &&
            allowedFileTypes.includes(selectedFile?.type) &&
            allowedFileSize > selectedFile.size
        ) {
            setFile(selectedFile);
            setFileSelectError(null);
        } else if (allowedFileTypes.includes(selectedFile?.type) == false) {
            setFile(null);
            setFileSelectError(
                "Please upload an image of proper format (jpg, jpeg, png or gif)"
            );
        } else {
            setFile(null);
            setFileSelectError(
                "Please upload an image file size less than 5mb"
            );
        }
    };

    const [tweetInput, setTweetInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTweetButton = async () => {
        if (fileSelectError) return;
        setLoading(true);

        const tweetCollectionRef = collection(db, "tweets");

        const filteredTweet = filter.isProfane(tweetInput)
            ? "I Got Banned for Saying: " + filter.clean(tweetInput)
            : tweetInput;

        if (file) {
            const storageRef = ref(
                storage,
                `/files/${auth?.currentUser?.email}/${file?.name}`
            );
            const uploadTask = uploadBytesResumable(storageRef, file);

            const unsub = uploadTask.on(
                "state_changed",
                () => {},
                (err) => {
                    setFileSelectError("Image Upload Failed");
                    setLoading(false);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(storageRef);
                        await addDoc(tweetCollectionRef, {
                            author: auth?.currentUser?.email,
                            date: serverTimestamp(),
                            imgSrc: url,
                            likes: [],
                            retweets: [],
                            tweetText: filteredTweet,
                        });
                        setTweetInput("");
                        setFile(null);
                        setLoading(false);
                        // Ban User
                        if (filter.isProfane(tweetInput)) {
                            const specificBanDoc = doc(
                                db,
                                "banned",
                                auth?.currentUser?.uid
                            );
                            try {
                                await setDoc(specificBanDoc, {
                                    email: auth?.currentUser?.email,
                                    uid: auth?.currentUser?.uid,
                                    timestamp: serverTimestamp(),
                                });
                            } catch (err) {
                                setLoading(false);
                            }
                        }
                    } catch (err) {
                        setFileSelectError(
                            "Post Failed to Post Please Try Again"
                        );
                        setLoading(false);
                        setTimeout(() => {
                            setFileSelectError("");
                        }, 3000);
                    }
                }
            );
            return unsub;
        } else {
            try {
                await addDoc(tweetCollectionRef, {
                    author: auth?.currentUser?.email,
                    date: serverTimestamp(),
                    imgSrc: "",
                    likes: [],
                    retweets: [],
                    tweetText: filteredTweet,
                });
                setTweetInput("");
                setFile(null);
                setLoading(false);
                // Ban User
                if (filter.isProfane(tweetInput)) {
                    const specificBanDoc = doc(
                        db,
                        "banned",
                        auth?.currentUser?.uid
                    );
                    try {
                        await setDoc(specificBanDoc, {
                            email: auth?.currentUser?.email,
                            uid: auth?.currentUser?.uid,
                            timestamp: serverTimestamp(),
                        });
                    } catch (err) {
                        setLoading(false);
                    }
                }
            } catch (err) {
                setFileSelectError("Post Failed to Post Please Try Again");
                setLoading(false);
                setTimeout(() => {
                    setFileSelectError("");
                }, 3000);
            }
        }
    };

    // Avatar
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        allUsers.map((specificUser) => {
            if (auth?.currentUser?.email == specificUser.user)
                setAvatarUrl(specificUser.avatar);
        });
    }, [allUsers]);

    return (
        <div>
            <Box
                sx={{
                    display: "flex",
                    padding: "4px 16px 8px 16px",
                    gap: "16px",
                }}
            >
                <Avatar src={avatarUrl} sx={{ marginTop: "3px" }} />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: "1",
                        gap: "0.2rem",
                    }}
                >
                    <Input
                        id="outlined-multiline-flexible"
                        placeholder="What's Happening?"
                        multiline
                        fullWidth
                        disableUnderline
                        sx={{
                            fontSize: "20px",
                            lineHeight: "24px",
                            color: "#0f1419",
                        }}
                        inputProps={{ maxLength: 280 }}
                        onChange={(e) => {
                            setTweetInput(e.target.value);
                        }}
                        value={tweetInput}
                    />
                    <hr style={{ border: "1px solid #EFF3F4" }} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <input
                            type="file"
                            style={{ display: "none" }}
                            ref={hiddenFileInput}
                            onChange={handleSelectedFile}
                        />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                        >
                            <Button onClick={handleMediaButton}>Media</Button>
                            {file && (
                                <FormHelperText>{file.name}</FormHelperText>
                            )}
                            {fileSelectError && (
                                <FormHelperText error>
                                    {fileSelectError}
                                </FormHelperText>
                            )}
                        </div>
                        <LoadingButton
                            variant="contained"
                            sx={{
                                bgcolor: "#1d9bf0",
                                borderRadius: "30px",
                                fontWeight: 600,
                                "&:hover": {
                                    bgcolor: "#1a8cd8",
                                },
                            }}
                            disabled={
                                !fileSelectError &&
                                (tweetInput.length != 0 || file)
                                    ? false
                                    : true
                            }
                            onClick={handleTweetButton}
                            loading={loading}
                        >
                            Post
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default TweetBox;

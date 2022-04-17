import { Avatar, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import AutorenewTwoToneIcon from "@mui/icons-material/AutorenewTwoTone";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import IosShareIcon from "@mui/icons-material/IosShare";
import "./tweet.css";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import { Comments } from ".";
import { LoadingButton } from "@mui/lab";
import { FormHelperText } from "@mui/material";
import Popover from "@mui/material/Popover";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";

function Tweet({
    tweetCollectionRef,
    fullNameEmail,
    tweetId,
    name,
    date,
    imgSrc,
    tweetText,
    likes,
    retweets,
    setShowCopyToClipboardAlert,
    setShowAddToBookmarksAlert,
    registeredUsers,
    allUsers,
}) {
    const handleLikeButton = async () => {
        const targetTweetRef = doc(db, "tweets", tweetId);
        if (likes.includes(auth?.currentUser?.email)) {
            const newLikes = likes.filter((like) => {
                return like != auth?.currentUser?.email;
            });
            await updateDoc(targetTweetRef, { likes: newLikes });
        } else {
            const newLikes = [...likes, auth?.currentUser?.email];
            await updateDoc(targetTweetRef, {
                likes: newLikes,
            });
        }
    };

    const handleRetweetButton = async () => {
        const targetTweetRef = doc(db, "tweets", tweetId);
        if (retweets.includes(auth?.currentUser?.email)) {
            const newRetweets = retweets.filter((retweet) => {
                return retweet != auth?.currentUser?.email;
            });
            await updateDoc(targetTweetRef, { retweets: newRetweets });
        } else {
            const newRetweets = [...retweets, auth?.currentUser?.email];
            await updateDoc(targetTweetRef, {
                retweets: newRetweets,
            });
        }
    };

    const handleDeleteButton = async (id) => {
        const targetTweetRef = doc(db, "tweets", id);
        await deleteDoc(targetTweetRef);
    };

    // Comments Modal Style
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        height: "70%",
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: "1rem",
        p: 1,
        outline: "none",
        overflow: "auto",
    };

    // Comments Firebase
    const [comments, setComments] = useState([]);

    const commentsCollectionRef = collection(db, "tweets", tweetId, "comments");
    const commentsQuery = query(
        commentsCollectionRef,
        orderBy("timestamp", "asc")
    );

    useEffect(() => {
        const unsub = onSnapshot(commentsQuery, (snapshot) => {
            setComments(
                snapshot.docs.map((comments) => ({
                    ...comments.data(),
                    id: comments.id,
                }))
            );
        });
        return unsub;
    }, []);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [commentsInput, setCommentsInput] = useState("");
    const [loadCommentButton, setLoadCommentButton] = useState(false);
    const [commentError, setCommentError] = useState(null);

    const handleCommentButton = async () => {
        setLoadCommentButton(true);
        try {
            await addDoc(commentsCollectionRef, {
                author: auth?.currentUser?.email,
                text: commentsInput,
                timestamp: serverTimestamp(),
            });
            setCommentsInput("");
            setLoadCommentButton(false);
        } catch (err) {
            setCommentError(err.message);
            setLoadCommentButton(false);
        }
    };

    // Popover for Share button
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? "simple-popover" : undefined;

    const handleClipboardAlert = () => {
        handleClosePopover();
        setShowCopyToClipboardAlert(true);
        setTimeout(() => {
            setShowCopyToClipboardAlert(false);
        }, 3000);
    };

    const handleAddBookmarkAlert = async () => {
        const bookmarksCollectionRef = collection(
            db,
            "users",
            registeredUsers[0]?.id,
            "bookmarks"
        );
        await addDoc(bookmarksCollectionRef, {
            author: fullNameEmail,
            date: date,
            imgSrc: imgSrc,
            likes: likes,
            tweetText: tweetText,
            dateBookmarked: serverTimestamp(),
        });
        handleClosePopover();
        setShowAddToBookmarksAlert(true);
        setTimeout(() => {
            setShowAddToBookmarksAlert(false);
        }, 3000);
    };

    // Handle User Avatar

    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        allUsers.map((specificUser) => {
            if (fullNameEmail == specificUser.user)
                setAvatarUrl(specificUser.avatar);
        });
    }, [allUsers]);

    return (
        <div>
            <div style={{ display: "flex", padding: "1rem", gap: "1rem" }}>
                <Avatar src={avatarUrl} />
                <div style={{ flex: "1" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            <h3 style={{ wordBreak: "break-word" }}>
                                {name}@
                                <span style={{ fontWeight: "400" }}>
                                    {name} · {date}
                                </span>
                            </h3>
                        </div>
                        {auth?.currentUser?.email == fullNameEmail && (
                            <Tooltip title="Delete Tweet">
                                <DeleteForeverTwoToneIcon
                                    fontSize="small"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                        handleDeleteButton(tweetId);
                                    }}
                                />
                            </Tooltip>
                        )}
                        {/* <DeleteForeverTwoToneIcon fontSize="small" /> */}
                    </div>
                    <h4
                        style={{
                            fontWeight: "400",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {tweetText}
                    </h4>
                    {imgSrc && (
                        <img
                            width={"100%"}
                            src={imgSrc}
                            alt=""
                            style={{ borderRadius: "1rem" }}
                        />
                    )}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        }}
                    >
                        {/* Comments */}
                        <div className="tweet-menu" onClick={handleOpen}>
                            <div className="tweet-menu-icons">
                                <CommentOutlinedIcon
                                    fontSize="small"
                                    sx={{ color: "#536471" }}
                                />
                            </div>
                            <h5
                                className="tweet-menu-count"
                                style={{ fontWeight: "100" }}
                            >
                                {comments.length}
                            </h5>
                        </div>
                        {/* Retweets */}
                        <div
                            className="tweet-menu"
                            onClick={handleRetweetButton}
                        >
                            <div className="tweet-menu-icons">
                                <AutorenewTwoToneIcon
                                    fontSize="small"
                                    sx={{
                                        color: "#536471",
                                        color:
                                            retweets?.includes(
                                                auth?.currentUser?.email
                                            ) && "#00BA7C",
                                    }}
                                />
                            </div>
                            <h5
                                className="tweet-menu-count"
                                style={{
                                    fontWeight: "100",
                                    color:
                                        retweets?.includes(
                                            auth?.currentUser?.email
                                        ) && "#00BA7C",
                                }}
                            >
                                {retweets?.length}
                            </h5>
                        </div>
                        {/* Likes */}
                        <div className="tweet-menu" onClick={handleLikeButton}>
                            <div className="tweet-menu-icons">
                                <FavoriteBorderTwoToneIcon
                                    fontSize="small"
                                    sx={{
                                        color: "#536471",
                                        color:
                                            likes.includes(
                                                auth?.currentUser?.email
                                            ) && "red",
                                    }}
                                />
                            </div>
                            <h5
                                className="tweet-menu-count"
                                style={{
                                    fontWeight: "100",
                                    color:
                                        likes.includes(
                                            auth?.currentUser?.email
                                        ) && "red",
                                }}
                            >
                                {likes.length}
                            </h5>
                        </div>
                        {/* Share Button */}
                        <div className="tweet-menu">
                            <div
                                className="tweet-menu-icons"
                                onClick={handlePopover}
                            >
                                <IosShareIcon
                                    fontSize="small"
                                    sx={{ visibility: "" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Button Popover */}
            <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    className="sidebarOption"
                    style={{ borderRadius: "0" }}
                    onClick={handleAddBookmarkAlert}
                >
                    Add Post to Bookmarks
                </Typography>
                {imgSrc && (
                    <CopyToClipboard text={imgSrc}>
                        <Typography
                            sx={{ p: 2, cursor: "pointer" }}
                            className="sidebarOption"
                            style={{ borderRadius: "0" }}
                            onClick={handleClipboardAlert}
                        >
                            Copy Image Url
                        </Typography>
                    </CopyToClipboard>
                )}
            </Popover>

            {/* Comment Button Modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {/* Close Button */}
                        <Box>
                            <CloseIcon
                                onClick={handleClose}
                                sx={{
                                    fontSize: "2rem",
                                    borderRadius: "1rem",
                                    transition: "background 0.3s",
                                    ":hover": {
                                        bgcolor: "rgba(15, 20, 25, 0.1)",
                                    },
                                }}
                            />
                        </Box>
                        {/* Comments */}
                        {comments.map((comment) => (
                            <Comments
                                key={comment.id}
                                comment={comment}
                                tweetId={tweetId}
                            />
                        ))}
                        {/* Comments Input */}
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
                                    placeholder="Add your reply"
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
                                        setCommentsInput(e.target.value);
                                    }}
                                    value={commentsInput}
                                />
                                <hr style={{ border: "1px solid #EFF3F4" }} />
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ fontWeight: "100" }}>
                                            Replying to{" "}
                                            <span
                                                style={{
                                                    fontWeight: "400",
                                                    color: "#6ABDF5",
                                                }}
                                            >
                                                @{name}
                                            </span>
                                        </h3>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <FormHelperText>
                                            {commentError && commentError}
                                        </FormHelperText>
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
                                                commentsInput.length != 0
                                                    ? false
                                                    : true
                                            }
                                            onClick={handleCommentButton}
                                            loading={loadCommentButton}
                                        >
                                            Reply
                                        </LoadingButton>
                                    </div>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default Tweet;

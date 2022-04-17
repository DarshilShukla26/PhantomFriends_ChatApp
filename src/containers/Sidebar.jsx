import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import "./sidebar.css";
import { auth, db } from "../firebase-config";
import HomeIcon1 from "../favicon.jpg"
import HomeIcon from "@mui/icons-material/Home";
import TagIcon from "@mui/icons-material/Tag";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import TwitterIcon from "@mui/icons-material/Twitter";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import TextField from "@mui/material/TextField";
import { doc, updateDoc } from "firebase/firestore";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import Tooltip from "@mui/material/Tooltip";

const StyledModal = styled(ModalUnstyled)`
    position: fixed;
    z-index: 1300;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Backdrop = styled("div")`
    z-index: -1;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
`;

function Sidebar({ allUsers }) {
    const navigate = useNavigate();

    const logout = async () => {
        await signOut(auth);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Avatar
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        allUsers.map((specificUser) => {
            if (auth?.currentUser?.email == specificUser.user)
                setAvatarUrl(specificUser.avatar);
        });
    }, [allUsers]);

    // Update Profile Picture Modal
    const [openModal, setopenModal] = useState(false);
    const handleOpenModal = () => setopenModal(true);
    const handleCloseModal = () => setopenModal(false);

    const [profileImgUrl, setProfileImgUrl] = useState("");

    const updateProfileImage = async () => {
        const specificUserCollectionRef = doc(
            db,
            "users",
            auth?.currentUser?.uid
        );
        await updateDoc(specificUserCollectionRef, {
            avatar: profileImgUrl,
        });
        handleCloseModal();
        window.location.reload();
    };

    return (
        <div className="sidebar">
            <div className="sidebar-menu">
                <div className="twitterLogo">
                    <div
                        className="sidebarOption"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <img src={HomeIcon1} width="50"
                            className="sidebarIcon"
                            sx={{ fontSize: "30px", color: "#1D9BF0" }}
                        />
                    </div>
                </div>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <HomeIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Home</h2>
                    </div>
                </NavLink>
                <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <TagIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Explore</h2>
                    </div>
                </NavLink>
                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <NotificationsIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Notifications</h2>
                    </div>
                </NavLink>
                <NavLink
                    to="/messages"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <MailOutlineIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Messages</h2>
                    </div>
                </NavLink>
                <NavLink
                    to="/bookmarks"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <BookmarkBorderIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Bookmarks</h2>
                    </div>
                </NavLink>
                <NavLink
                    to="/lists"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <ListAltIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Lists</h2>
                    </div>
                </NavLink>
                <NavLink
                    to="/loadprofile"
                    className={({ isActive }) =>
                        isActive
                            ? "activeSidebarOptionContainer"
                            : "sidebarOptionContainer"
                    }
                >
                    <div className="sidebarOption">
                        <PermIdentityIcon className="sidebarIcon" />
                        <h2 className="hide-at-1200px">Profile</h2>
                    </div>
                </NavLink>
                <Tooltip title="Tweet Page">
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: "30px",
                            height: "50px",
                            backgroundColor: "#1d9bf0",
                            "&:hover": {
                                backgroundColor: "#1a8cd8",
                            },
                            "@media (max-width: 1200px)": {
                                borderRadius: "5rem",
                                width: "4rem",
                                height: "4rem",
                            },
                        }}
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <div className="hide-at-1200px">Home Page</div>
                        <div className="show-at-1200px">
                            <HistoryEduIcon fontSize="large" />
                        </div>
                    </Button>
                </Tooltip>
            </div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <div
                    className="sidebar-account"
                    style={{ padding: "1rem", marginBottom: "-0.5rem" }}
                >
                    <Avatar src={avatarUrl} />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "0.75rem",
                            marginTop: "-0.5rem",
                        }}
                    >
                        <h4>{auth?.currentUser?.email}</h4>
                        <h5 style={{ fontWeight: "400" }}>
                            @{auth?.currentUser?.email}
                            {auth?.currentUser?.email.length > 12 && "..."}
                        </h5>
                    </div>
                </div>
                <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    className="sidebarOption"
                    onClick={handleOpenModal}
                    style={{ borderRadius: "0" }}
                >
                    Update Profile Picture
                </Typography>
                <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    className="sidebarOption"
                    onClick={logout}
                    style={{ borderRadius: "0" }}
                >
                    Log out {auth?.currentUser?.email}
                </Typography>
            </Popover>
            <div
                className="sidebar-profile-container sidebarOption"
                aria-describedby={id}
                onClick={handlePopover}
            >
                <div className="sidebar-account">
                    <Avatar src={avatarUrl} />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "0.75rem",
                            marginTop: "-0.5rem",
                        }}
                    >
                        <h4 className="hide-at-1200px">
                            {auth?.currentUser?.email.substring(0, 12)}
                            {auth?.currentUser?.email.length > 12 && "..."}
                        </h4>
                        <h5
                            className="hide-at-1200px"
                            style={{ fontWeight: "400" }}
                        >
                            @{auth?.currentUser?.email.substring(0, 12)}
                            {auth?.currentUser?.email.length > 12 && "..."}
                        </h5>
                    </div>
                </div>
                <MoreHorizIcon
                    sx={{
                        "@media (max-width: 1200px)": {
                            display: "none",
                        },
                    }}
                />
                {/* Modal Start */}
                <StyledModal
                    aria-labelledby="unstyled-modal-title"
                    aria-describedby="unstyled-modal-description"
                    open={openModal}
                    onClose={handleCloseModal}
                    BackdropComponent={Backdrop}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            aspectRatio: "3/1",
                            padding: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <h2>Update Profile Image</h2>

                        <Box
                            sx={{
                                gap: "1rem",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <TextField
                                id="standard-basic"
                                label="Please Enter Image Url"
                                variant="standard"
                                fullWidth
                                onChange={(e) => {
                                    setProfileImgUrl(e.target.value);
                                }}
                            />
                            <Button
                                variant="outlined"
                                onClick={updateProfileImage}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </StyledModal>
                {/* Modal End */}
            </div>
        </div>
    );
}

export default Sidebar;

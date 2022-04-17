import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { auth, db } from "../firebase-config";
import {
    Bookmarks,
    Explore,
    Lists,
    LoadProfile,
    Main,
    Messages,
    Notifications,
    Profile,
} from "../pages";

function Feed({ allUsers }) {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<Main allUsers={allUsers} />} />
                <Route path="/explore/*" element={<Explore />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/messages/*" element={<Messages />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/lists" element={<Lists />} />
                <Route
                    path="/profile/:username"
                    element={<Profile allUsers={allUsers} />}
                />
                <Route path="/loadprofile" element={<LoadProfile />} />
            </Routes>
        </div>
    );
}

export default Feed;

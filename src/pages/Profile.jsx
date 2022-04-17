import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExploreProfile } from ".";
import { auth, db } from "../firebase-config";

function Profile({ allUsers }) {
    const { username } = useParams();

    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(async () => {
        const usersCollectionRef = collection(db, "users");
        const usersQuery = query(
            usersCollectionRef,
            where("user", "==", auth?.currentUser?.email)
        );
        const registeredUsersData = await getDocs(usersQuery);
        setRegisteredUsers(
            registeredUsersData.docs.map((users) => ({ ...users.data() }))
        );
    }, []);

    return (
        <div>
            <div className="main-title">
                <h2 style={{ wordBreak: "break-all" }}>{username}'s Profile</h2>
            </div>
            <ExploreProfile
                allUsers={allUsers}
                profileSearch={username}
                registeredUsers={registeredUsers}
            />
        </div>
    );
}

export default Profile;

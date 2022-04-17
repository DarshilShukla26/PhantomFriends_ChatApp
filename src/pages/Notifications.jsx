import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box } from "@mui/material";

function Notifications(props) {
    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(async () => {
        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, orderBy("timestamp", "desc"));

        const registeredUsersData = await getDocs(q);
        setRegisteredUsers(
            registeredUsersData.docs.map((users) => ({ ...users.data() }))
        );
    }, []);

    return (
        <div>
            <p1>
                
                <br />
                <br />
                 Comming Soon....
            </p1>
        </div>
    );
}

export default Notifications;

import { Container } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Feed, Sidebar, WidgetSection } from ".";
import { db } from "../firebase-config";
import "./home.css";

function Home(props) {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(async () => {
        const usersCollectionRef = collection(db, "users");
        const registeredUsersData = await getDocs(usersCollectionRef);
        const users = registeredUsersData.docs.map((users) => ({
            ...users.data(),
            id: users.id,
        }));
        setAllUsers(users);
    }, []);

    return (
        <Container>
            <div className="home-container">
                <Sidebar allUsers={allUsers} />
                <Feed allUsers={allUsers} />
                <WidgetSection />
            </div>
        </Container>
    );
}

export default Home;

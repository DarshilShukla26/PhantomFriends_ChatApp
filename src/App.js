import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./containers";
import { auth } from "./firebase-config";
import { Loading, Login } from "./pages";

function App() {
    const [user, setUser] = useState("loading");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currUser) => {
            setUser(currUser);
        });
        return unsub;
    }, []);

    return (
        <div>
            <Routes>
                <Route
                    path="/*"
                    element={
                        user == "loading" ? (
                            <Loading />
                        ) : user ? (
                            <Home />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        user == "loading" ? (
                            <Loading />
                        ) : !user ? (
                            <Login />
                        ) : (
                            <Navigate to="/*" />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;

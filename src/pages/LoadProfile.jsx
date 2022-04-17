import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase-config";

function LoadProfile(props) {
    return (
        <div>
            <h1>Loading Profile...</h1>
            <Navigate to={"/profile/" + auth?.currentUser?.email} />
        </div>
    );
}

export default LoadProfile;

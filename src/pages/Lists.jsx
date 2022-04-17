import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import { Box, FormHelperText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { LoadingButton } from "@mui/lab";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

function Lists(props) {
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState("");
    const [sendError, setSendError] = useState("");

    const usersListCollectionRef = collection(
        db,
        "users",
        auth?.currentUser?.uid,
        "lists"
    );

    const handleSendButton = async () => {
        setLoading(true);
        try {
            await addDoc(usersListCollectionRef, {
                text: input,
                uid: auth?.currentUser?.uid,
                timestamp: serverTimestamp(),
            });
            setInput("");
            setSendError("");
            setLoading(false);
        } catch (err) {
            setSendError("Error Sending Message PLease Try Again");
            setLoading(false);
        }
    };

    const [reminders, setReminders] = useState([]);

    const q = query(usersListCollectionRef, orderBy("timestamp", "desc"));

    useEffect(() => {
        const unsub = onSnapshot(q, (snapshot) => {
            setReminders(
                snapshot.docs.map((reminders) => ({
                    ...reminders.data(),
                    id: reminders.id,
                }))
            );
        });
        return unsub;
    }, []);

    const handleClickReminder = async (id) => {
        const specificReminder = doc(
            db,
            "users",
            auth?.currentUser?.uid,
            "lists",
            id
        );
        setTimeout(async () => {
            await deleteDoc(specificReminder);
        }, 1000);
    };

    return (
        <div>
            <div className="main-title">
                <h2>Reminders Lists</h2>
            </div>
            <Box sx={{ display: "flex", padding: "1rem", gap: "1rem" }}>
                <Box sx={{ width: "100%" }}>
                    <Input
                        multiline
                        placeholder="Enter Text"
                        fullWidth
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        value={input}
                    />
                    {sendError && (
                        <FormHelperText error>{sendError}</FormHelperText>
                    )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LoadingButton
                        onClick={handleSendButton}
                        endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        Add
                    </LoadingButton>
                </Box>
            </Box>
            <FormGroup sx={{ padding: "1rem" }}>
                {reminders.map((reminder) => (
                    <FormControlLabel
                        key={reminder.id}
                        control={<Checkbox />}
                        label={reminder.text}
                        onClick={() => {
                            handleClickReminder(reminder.id);
                        }}
                    />
                ))}
            </FormGroup>
        </div>
    );
}

export default Lists;

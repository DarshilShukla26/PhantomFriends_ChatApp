import * as React from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FcGoogle } from "react-icons/fc";
import { FormHelperText, Paper } from "@mui/material";
import { auth, db, SignInWithGoogle } from "../firebase-config";
import { LoadingButton } from "@mui/lab";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © DORA "}

            {"."}
        </Typography>
    );
}

const theme = createTheme();

export default function SignIn() {
    const [registerError, setRegisterError] = React.useState("");
    const [loginError, setLoginError] = React.useState("");

    const [loading, setLoading] = React.useState(false);

    const registerEmail = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        try {
            const userCred = await createUserWithEmailAndPassword(
                auth,
                data.get("registerEmail"),
                data.get("registerPassword")
            );
            const specificUserDoc = doc(db, "users", userCred?.user?.uid);
            await setDoc(specificUserDoc, {
                user: data.get("registerEmail"),
                timestamp: serverTimestamp(),
                avatar: "",
            });
        } catch (err) {
            setRegisterError(err.message);
            setLoading(false);
        }
    };

    const loginUser = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        try {
            await signInWithEmailAndPassword(
                auth,
                data.get("loginEmail"),
                data.get("loginPassword")
            );
            // setLoginError("");
            // setLoading(false);
        } catch (err) {
            setLoginError(err.message);
            setLoading(false);
        }
    };

    const [toggleLogin, setToggleLogin] = React.useState(true);

    const handleToggleLogin = (event) => {
        event.preventDefault();
        setToggleLogin((prevValue) => !prevValue);
    };

    return (
        <div
            style={{
                backgroundImage:
                    "url(/Twitter-Clone/images/login-background.jpg)",
                height: "100vh",
                backgroundSize: "cover",
            }}
        >
            <ThemeProvider theme={theme}>
                <Container
                    component="main"
                    maxWidth="xs"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <CssBaseline />
                    {/* Login Page */}
                    {toggleLogin && (
                        <Paper
                            elevation={10}
                            sx={{ padding: "30px", marginTop: "0" }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    sx={{ m: 1, bgcolor: "secondary.main" }}
                                >
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <Box
                                    component="form"
                                    onSubmit={loginUser}
                                    noValidate
                                    sx={{ mt: 1 }}
                                >
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="loginEmail"
                                        autoComplete="email"
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="loginPassword"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                    {loginError && (
                                        <FormHelperText error>
                                            {loginError}
                                        </FormHelperText>
                                    )}
                                    <LoadingButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 1, mb: 2 }}
                                        loading={loading}
                                    >
                                        Sign In
                                    </LoadingButton>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                        onClick={SignInWithGoogle}
                                    >
                                        <FcGoogle />
                                        Sign In with Google
                                    </Button>
                                    <Grid container>
                                        <Grid item>
                                            <Link
                                                href="#"
                                                variant="body2"
                                                onClick={handleToggleLogin}
                                            >
                                                {
                                                    "Don't have an account? Sign Up"
                                                }
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                    )}
                    {/* Register Page */}
                    {!toggleLogin && (
                        <Paper
                            elevation={10}
                            sx={{ padding: "30px", marginTop: "64px" }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar
                                    sx={{ m: 1, bgcolor: "secondary.main" }}
                                >
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Register Account
                                </Typography>
                                <Box
                                    component="form"
                                    onSubmit={registerEmail}
                                    noValidate
                                    sx={{ mt: 1 }}
                                >
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="registerEmail"
                                        autoComplete="email"
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="registerPassword"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                    {registerError && (
                                        <FormHelperText error>
                                            {registerError}
                                        </FormHelperText>
                                    )}
                                    <LoadingButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 1, mb: 2 }}
                                        loading={loading}
                                    >
                                        Register
                                    </LoadingButton>
                                    <Grid container>
                                        <Grid item>
                                            <Link
                                                href="#"
                                                variant="body2"
                                                onClick={handleToggleLogin}
                                            >
                                                {
                                                    "Already have an account? Login"
                                                }
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                    )}
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        </div>
    );
}

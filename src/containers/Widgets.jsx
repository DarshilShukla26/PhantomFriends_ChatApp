import { Box } from "@mui/material";
import React, { useState } from "react";

function Widgets({ projectName, imageSrc, projectLink }) {
    const handleClickPortfolio = () => {
        window.open(projectLink);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#F7F9F9",
                borderRadius: "1rem",
                cursor: "pointer",
                ":hover": {
                    bgcolor: "#F2F4F4",
                },
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
            onClick={handleClickPortfolio}
        >
            <h4>{projectName}</h4>
            <img
                src={imageSrc}
                style={{ width: "100%", borderRadius: "1rem" }}
            />
        </Box>
    );
}

export default Widgets;

import React, { useState } from "react";
import "./widgetSection.css";
import { Widgets } from ".";
import { Box } from "@mui/material";

function WidgetSection(props) {
    return (
        <Box
            className="widgetContainer"
            sx={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                "@media(max-width: 1000px)": {
                    display: "none",
                },
            }}
        >
            <h2 style={{ marginTop: "1rem" }}>
                Thanks for visiting our social media app!
            </h2>
            <h3 style={{ fontWeight: "100" }}>
                Our other projects:
                <br></br>
                1.DORA EMS 
            </h3>
            
        </Box>
    );
}

export default WidgetSection;

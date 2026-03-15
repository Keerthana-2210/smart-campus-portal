import React, { useEffect } from "react";
import axios from "axios";

const CheatingDetector = ({ mockTestId, userToken }) => {
    useEffect(() => {
        // Helper function to send log to backend
        const logCheating = async (incidentType, description) => {
            try {
                await axios.post(
                    "http://localhost:5001/api/cheating",
                    {
                        mockTestId,
                        incidentType,
                        description,
                    },
                    {
                        headers: { Authorization: `Bearer ${userToken}` },
                    }
                );
                console.warn(`Cheating Detected: ${incidentType} - ${description}`);
            } catch (err) {
                console.error("Failed to log cheating incident", err);
            }
        };

        // 1. Detect Tab Switching / Minimizing
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logCheating("tab_switch", "User switched tabs or minimized the browser.");
                alert("Warning: You are not allowed to switch tabs during the test!");
            }
        };

        // 2. Detect Window Blur (clicking outside the window / split screen)
        const handleBlur = () => {
            logCheating("other", "Browser window lost focus.");
        };

        // 3. Detect Copy and Paste
        const handleCopy = (e) => {
            e.preventDefault();
            logCheating("other", "User attempted to copy content.");
            alert("Copying is disabled during the test.");
        };

        const handlePaste = (e) => {
            e.preventDefault();
            logCheating("other", "User attempted to paste content.");
            alert("Pasting is disabled during the test.");
        };

        // Attach Event Listeners
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("paste", handlePaste);

        // Cleanup Event Listeners on unmount
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("paste", handlePaste);
        };
    }, [mockTestId, userToken]);

    return <div style={{ display: "none" }}>{/* Invisible Tracker Component */}</div>;
};

export default CheatingDetector;

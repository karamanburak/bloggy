import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
    ...(mode === "dark"
        ? {
            grey: {
                100: "#f1f5f9", // slate-100
                200: "#e2e8f0", // slate-200
                300: "#cbd5e1", // slate-300
                400: "#94a3b8", // slate-400
                500: "#64748b", // slate-500
                600: "#475569", // slate-600
                700: "#334155", // slate-700
                800: "#1e293b", // slate-800
                900: "#0f172a", // slate-900
            },
            primary: {
                100: "#e0e7ff", // indigo-100
                200: "#c7d2fe", // indigo-200
                300: "#a5b4fc", // indigo-300
                400: "#818cf8", // indigo-400
                500: "#6366f1", // indigo-500
                600: "#4f46e5", // indigo-600
                700: "#4338ca", // indigo-700
                800: "#3730a3", // indigo-800
                900: "#312e81", // indigo-900
            },
            greenAccent: {
                100: "#d1fae5",
                200: "#a7f3d0",
                300: "#6ee7b7",
                400: "#34d399",
                500: "#10b981",
                600: "#059669",
                700: "#047857",
                800: "#065f46",
                900: "#064e3b",
            },
            redAccent: {
                100: "#ffe4e6",
                200: "#fecdd3",
                300: "#fda4af",
                400: "#fb7185",
                500: "#f43f5e",
                600: "#e11d48",
                700: "#be123c",
                800: "#9f1239",
                900: "#881337",
            },
            blueAccent: {
                100: "#dbeafe",
                200: "#bfdbfe",
                300: "#93c5fd",
                400: "#60a5fa",
                500: "#3b82f6",
                600: "#2563eb",
                700: "#1d4ed8",
                800: "#1e40af",
                900: "#1e3a8a",
            },
        }
        : {
            grey: {
                100: "#0f172a",
                200: "#1e293b",
                300: "#334155",
                400: "#475569",
                500: "#64748b",
                600: "#94a3b8",
                700: "#cbd5e1",
                800: "#e2e8f0",
                900: "#f1f5f9",
            },
            primary: {
                100: "#312e81",
                200: "#3730a3",
                300: "#4338ca",
                400: "#4f46e5",
                500: "#6366f1",
                600: "#818cf8",
                700: "#a5b4fc",
                800: "#c7d2fe",
                900: "#e0e7ff",
            },
            greenAccent: {
                100: "#064e3b",
                200: "#065f46",
                300: "#047857",
                400: "#059669",
                500: "#10b981",
                600: "#34d399",
                700: "#6ee7b7",
                800: "#a7f3d0",
                900: "#d1fae5",
            },
            redAccent: {
                100: "#881337",
                200: "#9f1239",
                300: "#be123c",
                400: "#e11d48",
                500: "#f43f5e",
                600: "#fb7185",
                700: "#fda4af",
                800: "#fecdd3",
                900: "#ffe4e6",
            },
            blueAccent: {
                100: "#1e3a8a",
                200: "#1e40af",
                300: "#1d4ed8",
                400: "#2563eb",
                500: "#3b82f6",
                600: "#60a5fa",
                700: "#93c5fd",
                800: "#bfdbfe",
                900: "#dbeafe",
            },
        }),
});

// mui theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);
    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                    // palette values for dark mode
                    primary: {
                        main: colors.primary[500],
                    },
                    secondary: {
                        main: colors.greenAccent[500],
                    },
                    neutral: {
                        dark: colors.grey[700],
                        main: colors.grey[500],
                        light: colors.grey[100],
                    },
                    background: {
                        default: colors.grey[900],
                        paper: colors.grey[800],
                    },
                }
                : {
                    // palette values for light mode
                    primary: {
                        main: colors.primary[500],
                    },
                    secondary: {
                        main: colors.greenAccent[500],
                    },
                    neutral: {
                        dark: colors.grey[700],
                        main: colors.grey[500],
                        light: colors.grey[100],
                    },
                    background: {
                        default: "#f8fafc", // slate-50
                        paper: "#ffffff",
                    },
                }),
        },
        typography: {
            fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
                fontSize: 14,
            },
        },
    };
};

// context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => { },
});

export const useMode = () => {
    const [mode, setMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        // Ensure class is set on initial load
        const htmlElement = document.documentElement;
        htmlElement.classList.remove("light", "dark");
        htmlElement.classList.add(savedTheme);
        return savedTheme;
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => {
                    const newMode = prev === "light" ? "dark" : "light";
                    const htmlElement = document.documentElement;
                    htmlElement.classList.remove("light", "dark");
                    htmlElement.classList.add(newMode);
                    localStorage.setItem("theme", newMode);
                    return newMode;
                })
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};
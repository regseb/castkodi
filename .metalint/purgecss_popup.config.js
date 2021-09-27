export default {
    content: "/src/popup/*.html",
    safelist: {
        standard: ["Chrome", "Firefox"],
        deep: [/^playlist-items$/u],
    },
};

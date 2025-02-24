import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        paddingVertical: 80,
        paddingHorizontal: 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    login: {
        backgroundColor: "#FEECE2",
    },
    other: {
        backgroundColor: "#EEF8EF",
    },
    title: {
        color: "#3F6453",
        fontSize: 28,
        fontFamily: "NotoSerif_700Bold",
        marginBottom: 12,
    },
    subtitle: {
        color: "#3F6453",
        fontSize: 16,
        fontFamily: "NotoSerif_400Regular",
        marginBottom: 20,
    },
    text: {
        color: "#3F6453",
        fontSize: 12,
        fontFamily: "NotoSerif_400Regular",
    },
    link: {
        color: "#3F6453",
        fontSize: 12,
        fontFamily: "NotoSerif_700Bold",
        textDecorationLine: "underline",
    },
    span: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    socials: {
        flexDirection: "row",
        gap: 28,
        alignSelf: "center",
    },
    socialIcon: {
        width: 40,
        height: 40,
    },
});

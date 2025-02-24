import { StyleSheet } from "react-native";

export default StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FCF4E8",
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#3F6453",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    leftIcon: {
        color: "#3F6453",
        marginLeft: 12,
    },
    rightIcon: {
        color: "#3F6453",
        marginRight: 12,
    },
    input: {
        flex: 1,
        marginHorizontal: 12,
        paddingVertical: 12,
        paddingRight: 12,
        paddingLeft: 0,
        borderRadius: 100,
        backgroundColor: "#FCF4E8",
        color: "#3F6453",
        fontFamily: "NotoSerif_400Regular",
    },
    pinCodeContainer: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: "#3F6453",
    },
    pinCodeText: {
        fontFamily: "NotoSerif_400Regular",
        fontSize: 36,
        color: "#3F6453",
    },
    focusedPinCodeContainer: {
        borderBottomWidth: 2,
        borderColor: "#3F6453",
    },
});

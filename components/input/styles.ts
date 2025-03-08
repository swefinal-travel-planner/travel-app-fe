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
  icon: {
    color: "#3F6453",
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 0,
    borderRadius: 100,
    backgroundColor: "#FCF4E8",
    color: "#3F6453",
    fontFamily: "NotoSerif_400Regular",
  },
});

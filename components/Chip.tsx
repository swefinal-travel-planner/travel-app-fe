import { useState } from "react";
import { Text, StyleSheet } from "react-native";

import PressableOpacity from "./PressableOpacity";

interface ChipProps {
  value: string;
  onSelect?: (value: string) => void;
  onDeselect?: (value: string) => void;
}

const Chip: React.FC<ChipProps> = ({ value, onSelect, onDeselect }) => {
  const [selected, setSelected] = useState(false);

  return (
    <PressableOpacity
      style={[styles.wrapper, selected ? styles.selectedBg : styles.baseBg]}
      onPress={() => {
        const newSelected = !selected;
        setSelected(newSelected);
        if (newSelected && onSelect) onSelect(value);
        if (!newSelected && onDeselect) onDeselect(value);
      }}
    >
      <Text
        style={[styles.value, selected ? styles.selectedText : styles.baseText]}
      >
        {value}
      </Text>
    </PressableOpacity>
  );
};

export default Chip;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  baseBg: {
    backgroundColor: "#EEF8EF",
    borderWidth: 1,
    borderColor: "#3F6453",
  },
  selectedBg: { backgroundColor: "#3F6453" },
  value: {
    fontSize: 16,
    fontFamily: "NotoSerif_400Regular",
  },
  baseText: { color: "#3F6453" },
  selectedText: { color: "#FFFFFF" },
});

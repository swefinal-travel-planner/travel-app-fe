import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Pressable from "@/components/Pressable";
import TextField from "@/components/input/TextField";
import Chip from "@/components/Chip";

import styles from "../styles";

const data = [
  { id: "1", value: "🥜 Peanuts" },
  { id: "2", value: "🌾 Gluten" },
  { id: "3", value: "🥛 Dairy" },
  { id: "4", value: "🦀 Shellfish" },
  { id: "5", value: "🫘 Soy" },
  { id: "6", value: "🥚 Eggs" },
  { id: "7", value: "🐟 Fish" },
];

export default function SignUpAllergies() {
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [hasSelectedItem, setHasSelectedItem] = useState<boolean>(false);

  const router = useRouter();

  const handlePress = () => {
    router.replace("/(tabs)");
  };

  const handleSelect = (value: string) => {
    setSelected([...selected, value]);
  };

  const handleDeselect = (value: string) => {
    setSelected(selected.filter((item) => item !== value));
  };

  useEffect(() => {
    setHasSelectedItem(selected.length > 0);
  }, [selected]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.container, styles.other]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Allergy info</Text>
        <Text style={styles.subtitle}>
          Do you have any allergies we should know about?
        </Text>

        <TextField
          placeholder="Type to search"
          leftIcon="search-outline"
          onChange={setQuery}
        />

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 12 }}
        >
          {data
            .filter((item) =>
              item.value.toLowerCase().includes(query.toLowerCase()),
            )
            .map((item) => (
              <Chip
                key={item.id}
                value={item.value}
                onSelect={handleSelect}
                onDeselect={handleDeselect}
              />
            ))}
        </View>

        <Pressable
          title="Save"
          onPress={handlePress}
          variant={hasSelectedItem ? "primary" : "disabled"}
          disabled={!hasSelectedItem}
          style={{ marginTop: 36 }}
        />

        <Pressable
          onPress={handlePress}
          title="Skip for now"
          variant="secondary"
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

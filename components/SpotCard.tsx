import { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import PressableOpacity from "./PressableOpacity";

interface SpotCardProps {
  spotName: string;
  spotLocation: string;
  spotImage: string;
  isSaved: boolean;
}

const SpotCard: React.FC<SpotCardProps> = ({
  spotName,
  spotLocation,
  spotImage,
  isSaved,
}) => {
  const [saved, setSaved] = useState(isSaved);

  return (
    <PressableOpacity style={styles.wrapper}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: spotImage }} style={styles.image} />

        <PressableOpacity
          style={styles.overlay}
          onPress={() => setSaved(!saved)}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={20}
            color="white"
          />
        </PressableOpacity>
      </View>

      <View style={styles.spotInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {spotName}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="location-outline"
            size={16}
            color="#A68372"
            style={{ marginRight: 4 }}
          />

          <Text style={styles.location} numberOfLines={1}>
            {spotLocation}
          </Text>
        </View>
      </View>
    </PressableOpacity>
  );
};

export default SpotCard;

const styles = StyleSheet.create({
  wrapper: {
    width: 256,
    height: 206,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#A68372",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#A68372",
  },
  overlay: {
    position: "absolute",
    top: -112,
    right: 8,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  spotInfo: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  name: {
    color: "#563D30",
    fontFamily: "NotoSerif_400Regular",
    fontSize: 16,
    clip: "ellipsis",
    marginTop: 2,
  },
  location: {
    color: "#A68372",
    fontFamily: "NotoSerif_400Regular",
    fontSize: 12,
    clip: "ellipsis",
    marginTop: 4,
  },
});
